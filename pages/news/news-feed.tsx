import Head from "next/head";
import * as React from "react";
import ErrorMessage from "../../components/error";
import Layout from "../../components/layout";
import Loading from "../../components/loading";
import FeedStory from "../../components/news/feedStory";
import {
  fetchArticles,
  fetchArticlesAfter,
  NewsArticle,
} from "../../utils/news";

export default function NewsFeed() {
  const [stories, setStories] = React.useState<NewsArticle[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchStories(null);
  }, []);

  const fetchStories = async (date: Date | null) => {
    let res = null;
    if (date === null) {
      res = await fetchArticles(3);
    } else {
      res = await fetchArticlesAfter(date, 3);
    }
    if (res !== null) {
      setStories(res!);
      setLoading(false);
    } else {
      setLoading(false);
      setError(
        "Uh oh! We ran into an error getting stories. Please try again."
      );
    }
  };

  if (loading || error)
    return (
      <>
        <Head>
          <title>NH DECA - News Feed</title>
        </Head>
        <Layout home="/images/highlight3.jpg" title="News Feed">
          {error ? <ErrorMessage message={error} /> : <Loading />}
        </Layout>
      </>
    );

  if (stories.length > 0)
    return (
      <>
        <Head>
          <title>NH DECA - News Feed</title>
        </Head>
        <Layout home="/images/highlight3.jpg" title="News Feed">
          <div className="space-y-5 px-2 tablet:px-10 pt-1">
            {stories.map((story) => (
              <FeedStory story={story} key={`${story.timestamp.getTime()}`} />
            ))}
          </div>
        </Layout>
      </>
    );

  return (
    <>
      <Head>
        <title>NH DECA - News Feed</title>
      </Head>
      <Layout home="/images/highlight3.jpg" title="News Feed">
        <>No error fallback</>
      </Layout>
    </>
  );
}
