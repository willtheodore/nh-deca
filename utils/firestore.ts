import firebase from "./firebase.js";
const db = firebase.firestore();

export interface Section {
  [key: string]: Page;
}

export interface Page {
  label: string;
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
    console.log(e);
  }
};
