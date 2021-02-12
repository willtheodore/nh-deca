import Head from "next/head";
import * as React from "react";
import Layout from "../../components/layout";
import { fetchMedia } from "../../utils/twitter";

interface TwitterMediaObject {
  media_key: string;
  type?: string;
  url: string;
}
interface PhotosProps {}
export default function Photos() {
  const [photos, setPhotos] = React.useState<TwitterMediaObject[]>([]);
  const [token, setToken] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [finished, setFinished] = React.useState(false);

  React.useEffect(() => {
    getTweets();
  }, []);

  const getTweets = async () => {
    setLoading(true);
    let response: any;
    if (token) response = await fetchMedia(token);
    else response = await fetchMedia();

    if (response) {
      const tweets = response.data.data;
      const nextToken = response.data.nextToken;
      console.log(nextToken);
      if (nextToken) {
        setToken(nextToken);
      }

      if (tweets && tweets.media) {
        const newPhotos = tweets.media.map(
          ({ media_key, url }: TwitterMediaObject) => ({
            media_key,
            url,
          })
        );

        if (photos.length > 0) {
          if (photos[photos.length - 2].media_key === newPhotos[0].media_key) {
            setFinished(true);
          } else {
            const arr = photos.slice();
            for (const photo of newPhotos) {
              arr.push(photo);
            }
            setPhotos(arr);
          }
        } else {
          setPhotos(newPhotos);
        }
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>NH DECA Photo Album</title>
      </Head>

      <Layout home="/images/highlight1.jpg" title="Photo Album">
        <>
          <div className="flex justify-center pt-10">
            <p className="text-3xl uppercase px-10 py-5 font-bold bg-white rounded-md text-decaBlue text-center">
              To submit a photo, just tweet with the #nhdeca!
            </p>
          </div>

          <div className="mx-2 tablet:mx-10 pt-10 flex flex-wrap">
            {photos.length > 0 &&
              photos.map((photo) => (
                <div
                  className="w-full tablet:w-1/2 flex-grow max-h-128"
                  key={photo.media_key}
                >
                  <img
                    className="object-cover h-full w-full"
                    src={photo.url}
                    alt="Photo Album photo"
                  />
                </div>
              ))}
          </div>

          <div className="flex justify-center pt-10">
            {loading ? (
              <img
                src="/svg/cached.svg"
                className="animate-spin bg-blue-500 p-5 rounded-full"
              />
            ) : (
              !finished && (
                <button
                  className="white-rounded text-5xl uppercase font-bold"
                  onClick={getTweets}
                >
                  Load More Photos
                </button>
              )
            )}
          </div>
        </>
      </Layout>
    </>
  );
}
