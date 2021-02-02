import firebase from "./firebase.js";
const db = firebase.firestore();

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
  heroURL?: string;
  content: string;
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
      return sectionArray;
    }
  } catch (e) {
    console.log("Error getting pages", e);
  }
};
