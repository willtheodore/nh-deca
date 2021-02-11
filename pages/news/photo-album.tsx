import Head from "next/head";
import * as React from "react";
import Modal from "react-responsive-modal";
import Layout from "../../components/layout";
import PhotoSubmitModal from "../../components/photoSubmitModal";
import { getPhotos } from "../../utils/firestore";
import { getTweetsByHashtag } from "../../utils/twitter";

interface PhotosProps {}
export default function Photos() {
  const [photos, setPhotos] = React.useState<string[]>([]);
  const [res, setRes] = React.useState<object | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [submitOpen, setSubmitOpen] = React.useState(false);

  React.useEffect(() => {
    getTweets();
  }, []);

  const getTweets = async () => {
    setLoading(true);
    const tweets = await getTweetsByHashtag("nhdeca");
    if (tweets) setRes(tweets);
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>NH DECA Photo Album</title>
      </Head>

      <Modal open={submitOpen} onClose={() => setSubmitOpen(false)} center>
        <PhotoSubmitModal />
      </Modal>

      <Layout home="/images/highlight1.jpg" title="Photo Album">
        <>
          <div className="flex justify-center pt-10">
            <button
              className="white-rounded text-3xl uppercase px-10 py-5 font-bold"
              onClick={() => setSubmitOpen(true)}
            >
              Submit a Photo
            </button>
          </div>

          {/* <div className="mx-2 tablet:mx-10 pt-10 flex flex-wrap">
            {photos.map((photoURL, index) => (
              <div className="w-1/2 tablet:w-1/3 flex-grow max-h-80">
                <img
                  key={index}
                  className="object-cover h-full w-full"
                  src={photoURL}
                  alt="Photo Album photo"
                />
              </div>
            ))}
          </div> */}

          {res && (
            <div className="w-full bg-white rounded-md p-5">
              <pre>{JSON.stringify(res, null, 2)}</pre>
            </div>
          )}

          <div className="flex justify-center pt-10">
            {loading ? (
              <img
                src="/svg/cached.svg"
                className="animate-spin bg-blue-500 p-5 rounded-full"
              />
            ) : (
              <button
                className="white-rounded text-5xl uppercase font-bold"
                onClick={getTweets}
              >
                Load Photos
              </button>
            )}
          </div>
        </>
      </Layout>
    </>
  );
}
