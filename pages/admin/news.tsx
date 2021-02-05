import Head from "next/head";
import * as React from "react";
import AdminLayout from "../../components/admin/adminLayout";
import CreateArticle, { Mode } from "../../components/admin/news/createArticle";
import ErrorMessage from "../../components/error";

export default function News() {
  const [mode, setMode] = React.useState<Mode>(Mode.default);
  const [error, setError] = React.useState<null | string>(null);

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
              <NewsSearch />
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
          {mode === Mode.search && <>{/* <SearchResults /> */}</>}
          {mode === Mode.add && (
            <CreateArticle setError={setError} setMode={setMode} />
          )}
          {mode === Mode.edit && <>{/* <EditArticle /> */}</>}
        </>
      </AdminLayout>
    </>
  );
}

function NewsSearch() {
  return (
    <div className="flex">
      <input type="text" className="bg-white border-none mr-3" />
      <button className="bg-decaBlue px-4 py-2 rounded-md text-white uppercase hover:bg-blue-500 transition-colors duration-300 border-none">
        SEARCH
      </button>
    </div>
  );
}
