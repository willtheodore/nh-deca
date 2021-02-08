import * as React from "react";
import { createArticle, NewsArticle } from "../../../utils/news";
import styles from "./createArticle.module.css";

interface CreateArticleProps {
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
}

export enum Mode {
  default,
  success,
  add,
  search,
  edit,
}

export default function CreateArticle({
  setError,
  setMode,
}: CreateArticleProps) {
  const [tags, setTags] = React.useState<string[]>([]);
  const titleRef = React.useRef<HTMLInputElement>(null);
  const authorRef = React.useRef<HTMLInputElement>(null);
  const tagInputRef = React.useRef<HTMLInputElement>(null);
  const contentRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    console.log("submit");
    const tagValues = tags.slice();
    const error = validate(titleRef, authorRef, contentRef);
    if (error !== null) {
      setError(error);
      return;
    }
    const title = titleRef.current!.value;
    const author = authorRef.current!.value;
    const content = contentRef.current!.value;
    const timestamp = new Date(Date.now());

    const article = new NewsArticle({
      title,
      author,
      content,
      tags: tagValues,
      timestamp,
    });
    const res = await createArticle(article);
    if (res === "Error")
      setError(
        "We ran into an error creating the article. Please try again later."
      );
    else setMode(Mode.success);
  };

  const removeTag = (index: number) => {
    const newTags = [];
    for (let i = 0; i < tags.length; i++) {
      if (i !== index) newTags.push(tags[i]);
    }
    setTags(newTags);
  };

  const addTag = (name: string) => {
    const newTags = tags.slice();
    newTags.push(name.toLowerCase());
    setTags(newTags);
    console.log(tags);
  };

  return (
    <form className="flex flex-col items-start mb-52">
      <label className={styles.label} htmlFor="title">
        Title
      </label>
      <input className={styles.field} ref={titleRef} type="text" id="title" />

      <label className={styles.label} htmlFor="author">
        Author
      </label>
      <input className={styles.field} ref={authorRef} type="text" id="author" />

      <label className={styles.label} htmlFor="tags">
        Tags
      </label>
      <div className="flex items-center w-1/2 mb-5">
        <input ref={tagInputRef} type="text" id="tags" className="w-full" />
        <button
          type="button"
          className={styles.blue}
          onClick={() => addTag(tagInputRef.current!.value.trim())}
        >
          ADD
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex items-center mb-10 space-x-2">
          <p className="text-white">Applied Tags:</p>
          {tags.map((tag, index) => (
            <p
              className={styles.tag}
              key={`${tag.length * (index + 1)}`}
              onClick={() => removeTag(index)}
            >
              {tag} <b className="text-red-500 pl-2">X</b>
            </p>
          ))}
        </div>
      )}

      <label className={styles.label}>Content</label>
      <p className="text-gray-400 mb-3">
        All website content is written using a "psuedo-language" called
        Markdown. For more information on how to write Markdown,{" "}
        <a
          href="https://www.markdownguide.org/basic-syntax/"
          target="__blank"
          className="text-decaBlue font-bold"
        >
          click here.
        </a>
        <br /> Tip: drag the bottom-right corner of the textbox to make it
        bigger.
        <br /> Another Tip: I don't reccomend starting your post content with a
        header. The post title will always be shown with the post, so it will
        likely seem redundant.
      </p>
      <textarea className={styles.textarea} ref={contentRef} />

      <button className={styles.submit} type="button" onClick={handleSubmit}>
        CREATE ARTICLE
      </button>
    </form>
  );
}

function validate(
  titleRef: React.RefObject<HTMLInputElement>,
  authorRef: React.RefObject<HTMLInputElement>,
  contentRef: React.RefObject<HTMLTextAreaElement>
): string | null {
  if (!titleRef.current)
    return "We had an issue getting the title. Refresh the page and try again.";
  if (!authorRef.current)
    return "We had an issue getting the author. Refresh the page and try again.";
  if (!contentRef.current)
    return "We had an issue getting the author. Refresh the page and try again.";

  const title = titleRef.current.value;
  const author = authorRef.current.value;
  const content = contentRef.current.value;
  if (title === "")
    return "The title field is empty. Please fill out the title field.";
  if (author === "")
    return "The author field is empty. Please fill out the author field.";
  if (content === "")
    return "The content field is empty. Please fill out the content field.";

  return null;
}
