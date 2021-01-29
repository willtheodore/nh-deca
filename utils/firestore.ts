import { db } from "./firebase";

export interface Section {
	[key: string]: Page;
}

export interface Page {
	label: string;
}

export const getSections = async () => {
	const sections: Section[] = [];
	const sectionsSnapshot = await db.collection("sections").get();
	sectionsSnapshot.forEach((doc) => {
		const pages: Section = doc.data();
		sections.push(pages);
	});
	return sections;
};
