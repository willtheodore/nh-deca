import * as React from "react";
import { deleteArticle, NewsArticle } from "../../../utils/news";
import { Mode } from "./createArticle";

interface SearchResultsProps {
  results: NewsArticle[] | null;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setEdit: React.Dispatch<React.SetStateAction<NewsArticle | null>>;
}

export default function SearchResults({
  results,
  setMode,
  setError,
  setEdit,
}: SearchResultsProps) {
  const handleEdit = async (article: NewsArticle) => {
    if (article.id) {
      setEdit(article);
      setMode(Mode.edit);
    } else {
      setError("We ran into an error editing that article. Please try again.");
    }
  };

  const handleDelete = async (article: NewsArticle) => {
    if (article.id) {
      const res = await deleteArticle(article.id);
      if (res === "Error")
        setError(
          "We ran into an error deleting that article. Please try again."
        );
      else {
        setMode(Mode.success);
      }
    } else {
      setError("We ran into an error deleting that article. Please try again.");
    }
  };

  return (
    <>
      {results &&
        results.map((article) => (
          <div
            className="w-full py-6 px-3 bg-white rounded-md flex justify-between items-center"
            key={article.title + article.author}
          >
            <h1 className="text-xl font-bold uppercase">{article.title}</h1>
            <div>
              <button
                className="bg-decaBlue px-4 py-2 uppercase hover:bg-blue-500 transition-colors duration-300 text-white tracking-wider mr-5 rounded-md"
                onClick={() => handleEdit(article)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 px-4 py-2 uppercase hover:bg-red-300 transition-colors duration-300 text-white tracking-wider rounded-md"
                onClick={() => {
                  handleDelete(article);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      <button
        className="bg-decaBlue px-4 py-2 uppercase hover:bg-blue-500 transition-colors duration-300 rounded-md text-white tracking-wider mt-10"
        onClick={() => setMode(Mode.default)}
      >
        BACK
      </button>
    </>
  );
}
