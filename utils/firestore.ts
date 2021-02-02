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
    const sectionsSnapshot = await db.collection("sections").get();
    sectionsSnapshot.forEach((doc) => {
      const pages: Section = doc.data();
      sections.push(pages);
    });
    return sections;
  } catch (e) {
    console.log(e);
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

export interface PageContent {
  title: string;
  slug?: string;
  heroURL: string | null;
  content: string;
  files?: FileList;
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
        paths.push([prefix, slug]);
      }
    });
    console.log("Returning paths: ", paths);
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
  file: FileList | null,
  files: FileList | null,
  content: string
) => {
  try {
    if (heroURL && file && file.length === 1) {
      if (file[0].name === heroURL) {
        const pageImagesRef = storage.ref().child(`pageImages/${heroURL}`);
        await pageImagesRef.put(file[0]);
      }
    }

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const filesRef = storage.ref().child(`pageFiles/${files[i].name}`);
        await filesRef.put(files[i]);
      }
    }

    await db
      .collection("content")
      .doc(slug)
      .set({
        title,
        heroURL: heroURL ? heroURL : null,
        content,
        files: files ? files : null,
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
