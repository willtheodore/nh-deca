import { GetStaticPropsContext } from "next";
import Head from "next/head";
import React from "react";
import ClearButton from "../components/clearButton";
import Layout from "../components/layout";
import StoryPreview from "../components/storyPreview";
import { BannerSchema, getHomeContent, HomeContent } from "../utils/firestore";

interface HomeProps {
  homeContent: HomeContent;
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const homeContent = await getHomeContent();

  return {
    props: {
      homeContent,
    },
  };
}

export default function Home({ homeContent }: HomeProps) {
  return (
    <>
      <Head>
        <title>NH DECA</title>
      </Head>

      <Layout home="/images/hero.png">
        {homeContent && (
          <>
            <Banner banner={homeContent.banner} />
            <div className="mx-5 tablet:mx-10 my-5 tablet:my-10">
              <h1 className="header-caps-bold text-white mb-5 tablet:mb-10">
                Recent Stories:
              </h1>
              <div className="flex flex-col tablet:flex-row space-y-5 tablet:space-x-5 tablet:space-y-0">
                <StoryPreview />
                <StoryPreview />
                <StoryPreview />
              </div>
            </div>
            <PhotoAlbumPreview
              photos={[
                "images/highlight1.jpg",
                "images/highlight2.png",
                "images/highlight3.jpg",
              ]}
            />
          </>
        )}
      </Layout>
    </>
  );
}

interface BannerProps {
  banner: BannerSchema;
}

function Banner({ banner }: BannerProps) {
  return (
    <div className="flex flex-col bg-blue-800 w-screen tablet:items-center tablet:text-center items-start text-white px-4 py-8 tablet:py-12">
      <h1 className="header-caps-bold mb-4">{banner.title}</h1>
      <p className="text-xl">{banner.content}</p>
    </div>
  );
}

interface PhotoAlbumPreviewProps {
  photos: string[];
}

function PhotoAlbumPreview({ photos }: PhotoAlbumPreviewProps) {
  const alt = "A preview photo for the NH DECA photo album";

  return (
    <>
      <div className="grid grid-rows-3 grid-cols-1 tablet:grid-cols-3 tablet:grid-rows-1 w-screen relative">
        {photos.map((src, index) => (
          <img
            className="row-span-1 col-span-1 object-cover h-screen-1/3 tablet:h-screen-1/2 w-full"
            key={src}
            src={src}
            alt={alt}
          />
        ))}
        <ClearButton
          text="View Photos"
          href="/photos"
          styles="absolute bottom-5 right-1/2 transform translate-x-1/2"
        />
      </div>
    </>
  );
}
