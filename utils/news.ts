import firebase from "firebase";
import fire from "./firebase";
const db = fire.firestore();

interface NewsArticleInit {
  title: string;
  content: string;
  tags: string[];
  author?: string;
  timestamp?: Date;
}

export class NewsArticle {
  title: string;
  content: string;
  author: string | null;
  timestamp: Date;
  tags: string[];

  constructor({ title, content, tags, author, timestamp }: NewsArticleInit) {
    this.title = title;
    this.content = content;
    this.author = author ? author : null;
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
      .orderBy("timestamp", "asc")
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
      .orderBy("timestamp", "asc")
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

export async function createArticle(article: NewsArticle) {
  try {
    await db.collection("articles").withConverter(newsConverter).add(article);
    return "Success";
  } catch (e) {
    console.log("Error creating a news article", e);
    return "Error";
  }
}
