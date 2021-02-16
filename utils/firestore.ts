import firebase from "./firebase.js";
const db = firebase.firestore();
const storage = firebase.storage();

export interface Section {
  [key: string]: Page;
}

export interface Page {
  label: string;
  index: number;
  slug?: string;
}

export const getSections = async () => {
  try {
    const sections: Section[] = [];
    const sectionsQuery = db
      .collection("sections")
      .orderBy(firebase.firestore.FieldPath.documentId());
    const sectionsSnapshot = await sectionsQuery.get();
    sectionsSnapshot.forEach((doc) => {
      const pages: Section = doc.data();
      sections.push(pages);
    });
    return sections;
  } catch (e) {
    console.log(e);
  }
};

export const addPageToSection = async (
  section: string,
  page: string,
  index: number
) => {
  try {
    const pageLabel = page.trim();
    const pageSlug = pageLabel.toLowerCase().replace(" ", "-");
    await db
      .collection("sections")
      .doc(section)
      .update({
        [pageSlug]: {
          label: pageLabel,
          index: index,
        },
      });

    await rebuild();
  } catch (e) {
    console.log("Error adding page to section", e);
  }
};

export const swapPages = async (
  section: string,
  pages: Section,
  i1: number,
  i2: number
) => {
  try {
    if (Math.abs(i1 - i2) !== 1) throw Error("indexes are not adjacent");
    const newPages: Section = {};
    for (const page in pages) {
      if (pages[page].index === i1) {
        newPages[page] = {
          label: pages[page].label,
          index: i2,
        };
      } else if (pages[page].index === i2) {
        newPages[page] = {
          label: pages[page].label,
          index: i1,
        };
      } else {
        newPages[page] = pages[page];
      }
    }
    await db.collection("sections").doc(section).set(newPages);

    await rebuild();
  } catch (e) {
    console.log("Error changing page order", e);
  }
};

export const removePageAtIndex = async (
  section: string,
  pages: Section,
  index: number
) => {
  try {
    const newPages: Section = {};
    let pageSlug = "";
    for (const page in pages) {
      const currentIndex = pages[page].index;
      if (currentIndex !== index) {
        if (currentIndex < index) {
          newPages[page] = {
            label: pages[page].label,
            index: pages[page].index,
          };
        } else {
          newPages[page] = {
            label: pages[page].label,
            index: pages[page].index - 1,
          };
        }
      } else {
        pageSlug = page;
      }
    }
    await db.collection("sections").doc(section).set(newPages);
    const slug = section.concat(`\\${pageSlug}`);
    await db.collection("content").doc(slug).delete();

    await rebuild();
  } catch (e) {
    console.log("Error removing a page from the section", e);
  }
};

export interface BannerSchema {
  title: string;
  content: string;
}

export interface HomeContent {
  banner: BannerSchema;
}

export const getHomeContent = async () => {
  try {
    const homeSnapshot = await db.collection("content").doc("home").get();
    return homeSnapshot.data() as HomeContent;
  } catch (e) {
    console.log("Error getting home content", e);
  }
};

export const updateHomeContent = async (
  bannerTitle: string,
  bannerContent: string
) => {
  try {
    await db
      .collection("content")
      .doc("home")
      .set({
        banner: {
          title: bannerTitle,
          content: bannerContent,
        },
      });

    await rebuild();
  } catch (e) {
    console.log("Error updating home content", e);
  }
};

export interface PageContent {
  title: string;
  slug?: string;
  heroURL: string | null;
  content: string;
  files?: string[];
}

export const getPage = async (slug: string) => {
  try {
    const pageSnapshot = await db.collection("content").doc(slug).get();
    return pageSnapshot.data() as PageContent;
  } catch (e) {
    console.log("Error getting page", e);
  }
};

export type PageSlug = string[];
export type Paths = PageSlug[];

export const getPagePaths = async () => {
  try {
    const sectionsSnapshot = await db.collection("sections").get();
    const paths: Paths = [];
    sectionsSnapshot.forEach((sectionSnapshot) => {
      const section = sectionSnapshot.data();
      const prefix = sectionSnapshot.id;
      for (const slug in section) {
        if (prefix !== "news") {
          paths.push([prefix, slug]);
        }
      }
    });
    console.log("Returning paths:", paths);
    return paths;
  } catch (e) {
    console.log("Error getting paths: ", e);
  }
};

export const getValidationCode = async () => {
  try {
    const codeDocSnap = await db
      .collection("adminData")
      .doc("validationCode")
      .get();
    const codeDoc = codeDocSnap.data();
    if (codeDoc) {
      const code = codeDoc.code;
      return code;
    }
  } catch (e) {
    console.log("Error getting validation code", e);
  }
};

export const setValidationCode = async (code: string) => {
  try {
    await db.collection("adminData").doc("validationCode").update({
      code,
    });
    return "Success";
  } catch (e) {
    console.log("Error getting validation code", e);
    return "Error";
  }
};

export const getPagesBySection = async (section: string) => {
  try {
    const sectionData = (
      await db.collection("sections").doc(section).get()
    ).data();
    if (sectionData) {
      const sectionArray: Page[] = [];
      for (const slug in sectionData) {
        const page = sectionData[slug];
        sectionArray.push({
          slug,
          ...page,
        });
      }
      sectionArray.sort((s1, s2) => s1.index - s2.index);
      return sectionArray;
    }
  } catch (e) {
    console.log("Error getting pages", e);
  }
};

export const getContentBySlug = async (slug: string) => {
  try {
    const contentSnap = await db.collection("content").doc(slug).get();
    return {
      slug: contentSnap.id,
      ...(contentSnap.data() as PageContent),
    };
  } catch (e) {
    console.log("Error getting page content", e);
  }
};

export const updatePageContent = async (
  title: string,
  slug: string,
  heroURL: string | null,
  heroFile: File | null,
  content: string
) => {
  try {
    if (heroURL && heroFile && heroFile.name === heroURL) {
      const pageImagesRef = storage.ref().child(`pageImages/${heroURL}`);
      await pageImagesRef.put(heroFile);
    }

    await db
      .collection("content")
      .doc(slug)
      .set({
        title,
        heroURL: heroURL ? heroURL : null,
        content,
      });
    const slugSplit = slug.split("\\");
    const index = await getIndex(slugSplit);
    await db
      .collection("sections")
      .doc(slugSplit[0])
      .update({
        [slugSplit[1]]: {
          label: title,
          index,
        },
      });

    await rebuild();

    return "Success";
  } catch (e) {
    console.log("Error updating content", e);
    return "Fail";
  }
};

const getIndex = async (slugs: string[]) => {
  const section = (await db.collection("sections").doc(slugs[0]).get()).data();
  if (section) {
    const page = section[slugs[1]];
    return page.index;
  } else {
    throw Error("No section document while retrieving index");
  }
};

export const getImageURL = async (path: string) => {
  try {
    const url = await storage
      .ref()
      .child(`pageImages/${path}`)
      .getDownloadURL();
    return url;
  } catch (e) {
    console.log("Error getting image URL", e);
  }
};

export const getPhotos = async (token: string | null) => {
  try {
    const ref = storage.ref().child("photos/");
    const list = await ref.list({
      maxResults: 9,
      pageToken: token ? token : undefined,
    });
    const contents = list.items;
    const nextToken = list.nextPageToken;
    const photos: string[] = [];

    for (const photoRef of contents) {
      const url = await photoRef.getDownloadURL();
      photos.push(url);
    }
    return [photos, nextToken];
  } catch (e) {
    console.log("Error getting photos for photo album", e);
  }
};

export async function rebuild() {
  // Rebuild static parts of site.
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "https://api.vercel.com/v1/integrations/deploy/prj_c9TomFg0BO77pPplzVz4gMtbiCxm/eZmVAAgD2y",
    true
  );
  xhr.send();
}
