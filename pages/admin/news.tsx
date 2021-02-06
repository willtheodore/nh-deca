import Head from "next/head";
import * as React from "react";
import AdminLayout from "../../components/admin/adminLayout";
import CreateArticle, { Mode } from "../../components/admin/news/createArticle";
import EditArticle from "../../components/admin/news/editArticle";
import SearchResults from "../../components/admin/news/serarchResults";
import ErrorMessage from "../../components/error";
import { NewsArticle, searchArticles } from "../../utils/news";

export default function News() {
  const [mode, setMode] = React.useState<Mode>(Mode.default);
  const [results, setResults] = React.useState<NewsArticle[] | null>(null);
  const [edit, setEdit] = React.useState<NewsArticle | null>(null);
  const [error, setError] = React.useState<null | string>(null);

  const handleSearch = async (searchRef: React.RefObject<HTMLInputElement>) => {
    setResults(null);
    if (!searchRef.current) setError("We couldn't find the search input.");
    else {
      const searchInput = searchRef.current.value.trim();
      const res = await searchArticles(searchInput);
      if (res === "Error" || res.length === 0)
        setError(
          "We were unable to find any articles with that title. As a reminder, all searches are case sensitive. " +
            "Make sure your spelling is okay, then try again!"
        );
      else {
        setResults(res);
        setMode(Mode.search);
      }
    }
  };

  if (error !== null)
    return (
      <>
        <Head>
          <title>
            Admin - Change or Create articles in the NH DECA News Feed
          </title>
        </Head>

        <AdminLayout>
          <ErrorMessage message={error} onClick={() => setError(null)} />
        </AdminLayout>
      </>
    );

  return (
    <>
      <Head>
        <title>
          Admin - Change or Create articles in the NH DECA News Feed
        </title>
      </Head>

      <AdminLayout>
        <>
          <h1 className="uppercase text-4xl text-white pt-5 font-semibold">
            Manage the News Feed
          </h1>
          <p className="text-gray-400 mb-3">
            Click "create new article" to create a new article. To edit or
            delete an old article, enter its title and hit "search".
          </p>

          {mode === Mode.default && (
            <>
              <NewsSearch handleSearch={handleSearch} />
              <button
                className="bg-decaBlue rounded-full text-white px-4 py-2 mt-5 hover:bg-blue-500 transition-colors duration-300"
                onClick={() => setMode(Mode.add)}
              >
                Create New Article
              </button>
            </>
          )}

          {mode === Mode.success && (
            <p
              className="text-green-400 text-4xl uppercase my-10 font-bold cursor-pointer mx-auto"
              onClick={() => setMode(Mode.default)}
            >
              Success! Click me to go back to the home new editing page.
            </p>
          )}

          {mode === Mode.search && (
            <SearchResults
              results={results}
              setEdit={setEdit}
              setMode={setMode}
              setError={setError}
            />
          )}

          {mode === Mode.add && (
            <CreateArticle setError={setError} setMode={setMode} />
          )}

          {mode === Mode.edit && (
            <EditArticle article={edit} setError={setError} setMode={setMode} />
          )}
        </>
      </AdminLayout>
    </>
  );
}

interface NewsSearchProps {
  handleSearch: (ref: React.RefObject<HTMLInputElement>) => Promise<void>;
}

function NewsSearch({ handleSearch }: NewsSearchProps) {
  const searchRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex">
      <input
        type="text"
        className="bg-white border-none mr-3 w-1/2"
        ref={searchRef}
      />
      <button
        className="bg-decaBlue px-4 py-2 rounded-md text-white uppercase hover:bg-blue-500 transition-colors duration-300 border-none"
        onClick={() => handleSearch(searchRef)}
      >
        SEARCH
      </button>
    </div>
  );
}
