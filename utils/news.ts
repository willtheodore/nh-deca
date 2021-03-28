import firebase from "firebase";
import fire from "./firebase";
import { rebuild } from "./firestore";
const db = fire.firestore();

interface NewsArticleInit {
  title: string;
  content: string;
  tags: string[];
  author?: string;
  id?: string;
  timestamp?: Date;
}

export class NewsArticle {
  title: string;
  content: string;
  author: string | null;
  id: string | null;
  timestamp: Date;
  tags: string[];

  constructor({
    title,
    content,
    tags,
    author,
    timestamp,
    id,
  }: NewsArticleInit) {
    this.title = title;
    this.content = content;
    this.author = author ? author : null;
    this.id = id ? id : null;
    this.tags = tags;
    this.timestamp = timestamp ? timestamp : new Date(Date.now());
  }

  toString() {
    return `Article "${
      this.title
    }" written on ${this.timestamp.toDateString()} by ${
      this.author ? this.author : "null"
    }.`;
  }

  returnData() {
    return {
      title: this.title,
      author: this.author,
      tags: this.tags,
      content: this.content,
      timestamp: this.timestamp.getTime(),
    };
  }

  addTag(tag: string) {
    this.tags.push(tag);
  }

  removeTag(tag: string) {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      const newTags = [];
      for (let i = 0; i < this.tags.length; i++) {
        if (i !== index) newTags.push(this.tags[i]);
      }
      this.tags = newTags;
    }
  }

  setTitle(title: string) {
    this.title = title;
  }

  setContent(content: string) {
    this.content = content;
  }
}

const newsConverter = {
  toFirestore: (article: NewsArticle) => ({
    title: article.title,
    author: article.author,
    tags: article.tags,
    id: article.id,
    timestamp: firebase.firestore.Timestamp.fromDate(article.timestamp),
    content: article.content,
  }),
  fromFirestore: (
    snapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>,
    options: firebase.firestore.SnapshotOptions
  ) => {
    const data = snapshot.data(options);
    if (data) {
      return new NewsArticle({
        id: snapshot.id,
        title: data.title,
        author: data.author,
        tags: data.tags,
        timestamp: data.timestamp.toDate(),
        content: data.content,
      });
    } else {
      throw Error("Error converting from firestore to news article object");
    }
  },
};

export async function fetchArticles(limit: number) {
  try {
    const articles = await db
      .collection("articles")
      .orderBy("timestamp", "desc")
      .withConverter(newsConverter)
      .limit(limit)
      .get();

    const arr: NewsArticle[] = [];
    articles.forEach((articleSnapshot) => {
      arr.push(articleSnapshot.data());
    });
    return arr;
  } catch (e) {
    console.log("Error fetching stories", e);
  }
}

export async function fetchArticlesAfter(date: Date, limit: number) {
  try {
    const articles = await db
      .collection("articles")
      .orderBy("timestamp", "desc")
      .withConverter(newsConverter)
      .startAfter(firebase.firestore.Timestamp.fromDate(date))
      .limit(limit)
      .get();

    const arr: NewsArticle[] = [];
    articles.forEach((articleSnapshot) => {
      arr.push(articleSnapshot.data());
    });
    return arr;
  } catch (e) {
    console.log("Error fetching stories", e);
  }
}

export async function fetchArticlesBetween(sDate: Date, eDate: Date) {
  try {
    const articles = await db
      .collection("articles")
      .where("timestamp", ">=", firebase.firestore.Timestamp.fromDate(sDate))
      .where("timestamp", "<=", firebase.firestore.Timestamp.fromDate(eDate))
      .orderBy("timestamp", "desc")
      .withConverter(newsConverter)
      .get();

    const arr: NewsArticle[] = [];
    articles.forEach((articleSnapshot) => {
      arr.push(articleSnapshot.data());
    });
    return arr;
  } catch (e) {
    console.log("Error fetching filtered stories", e);
  }
}

export async function fetchArticlesWithTags(tags: string[]) {
  try {
    const articles = await db
      .collection("articles")
      .where("tags", "array-contains-any", tags)
      .orderBy("timestamp", "desc")
      .withConverter(newsConverter)
      .get();

    const arr: NewsArticle[] = [];
    articles.forEach((articleSnapshot) => {
      arr.push(articleSnapshot.data());
    });
    return arr;
  } catch (e) {
    console.log("Error fetching filtered stories", e);
  }
}

export async function createArticle(article: NewsArticle) {
  try {
    await db.collection("articles").withConverter(newsConverter).add(article);
    await rebuild();
    return "Success";
  } catch (e) {
    console.log("Error creating a news article", e);
    return "Error";
  }
}

type SearchResults = "Error" | NewsArticle[];
export async function searchArticles(query: string): Promise<SearchResults> {
  try {
    const res = await db
      .collection("articles")
      .where("title", "==", query)
      .withConverter(newsConverter)
      .get();

    const article: NewsArticle[] = [];
    res.forEach((snap) => {
      article.push(snap.data());
    });

    return article;
  } catch (e) {
    console.log("Error searching for articles", e);
    return "Error";
  }
}

export async function deleteArticle(id: string) {
  try {
    await db.collection("articles").doc(id).delete();
    await rebuild();
    return "Success";
  } catch (e) {
    console.log("Error deleting article", e);
    return "Error";
  }
}

export async function editArticle(article: NewsArticle) {
  try {
    await db
      .collection("articles")
      .doc(article.id!)
      .withConverter(newsConverter)
      .set(article);
    await rebuild();
    return "Success";
  } catch (e) {
    console.log("Error saving changes to article", e);
    return "Error";
  }
}
