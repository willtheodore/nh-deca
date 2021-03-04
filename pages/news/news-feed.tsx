import Head from "next/head";
import * as React from "react";
import ErrorMessage from "../../components/error";
import Layout from "../../components/layout";
import Loading from "../../components/loading";
import FeedStory from "../../components/news/feedStory";
import { Modal } from "react-responsive-modal";
import {
  fetchArticles,
  fetchArticlesAfter,
  NewsArticle,
} from "../../utils/news";
import FilterModal from "../../components/news/filterModal";

export default function NewsFeed() {
  const [stories, setStories] = React.useState<NewsArticle[]>([]);
  const [filter, setFilter] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [end, setEnd] = React.useState(false);

  React.useEffect(() => {
    fetchStories(null);
  }, []);

  const fetchStories = async (date: Date | null) => {
    let res = null;
    if (date === null) {
      setLoading(true);
      res = await fetchArticles(3);

      if (res !== null) {
        setStories(res!);
        setLoading(false);
      } else {
        setLoading(false);
        setError(
          "Uh oh! We ran into an error getting stories. Please try again."
        );
      }
    } else {
      res = await fetchArticlesAfter(date, 3);
      if (res && res.length > 0) {
        const newStories = stories.slice();
        for (const article of res) {
          stories.push(article);
        }
        setStories(newStories);
      } else if (res && res.length === 0) {
        setEnd(true);
      } else {
        setError(
          "Uh oh! We ran into an error getting stories. Please try again."
        );
      }
    }
  };

  if (loading || error)
    return (
      <>
        <Head>
          <title>NH DECA - News Feed</title>
        </Head>

        <Layout home="/images/h9.jpg" title="News Feed">
          {error ? (
            <ErrorMessage onClick={() => setError(null)} message={error} />
          ) : (
            <Loading />
          )}
        </Layout>
      </>
    );

  return (
    <>
      <Head>
        <title>NH DECA - News Feed</title>
      </Head>

      <Layout home="/images/h9.jpg" title="News Feed">
        <>
          <Modal open={filterOpen} onClose={() => setFilterOpen(false)} center>
            <FilterModal
              setFilter={setFilter}
              setStories={setStories}
              setError={setError}
              setFilterOpen={setFilterOpen}
            />
          </Modal>

          <div className="space-y-5 px-2 tablet:px-10 pt-1 flex flex-col items-center">
            <button
              className="px-4 py-2 bg-white rounded-md text-decaBlue uppercase font-semibold tracking-wider hover:bg-blue-100 transition duration-300 mt-2 "
              onClick={() => setFilterOpen(true)}
            >
              FILTER
            </button>

            {filter && (
              <p
                className="text-white hover:bg-blue-100 hover:text-decaBlue px-4 py-2 rounded-md cursor-pointer transition duration-300"
                onClick={() => {
                  setFilter(null);
                  fetchStories(null);
                }}
              >
                {filter + " Click to clear filter."}
              </p>
            )}

            {stories.map((story, index) => (
              <>
                <FeedStory story={story} key={`${story.timestamp.getTime()}`} />
                {index === stories.length - 1 && !end && !filter && (
                  <button
                    className="text-white text-4xl font-bold hover:bg-blue-100 hover:text-decaBlue rounded-md px-4 py-2 transition duration-300"
                    onClick={() => fetchStories(story.timestamp)}
                  >
                    LOAD MORE STORIES
                  </button>
                )}
                {index === stories.length - 1 && end && (
                  <p className="text-white uppercase">
                    This is the end of the news feed.
                  </p>
                )}
              </>
            ))}

            {stories.length === 0 && (
              <p className="text-white bg-decaBlue rounded-md px-4 py-2">
                NO STORIES COULD BE FOUND
              </p>
            )}
          </div>
        </>
      </Layout>
    </>
  );
}
