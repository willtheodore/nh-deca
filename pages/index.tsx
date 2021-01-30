import { GetStaticPropsContext } from "next";
import Head from "next/head";
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

      {homeContent && <Banner banner={homeContent.banner} />}
    </>
  );
}

interface BannerProps {
  banner: BannerSchema;
}

function Banner({ banner }: BannerProps) {
  return (
    <div className="flex flex-col bg-blue-800 w-screen tablet:items-center tablet:text-center items-start text-white px-4 py-8 tablet:py-12">
      <h1 className="uppercase text-2xl tablet:text-4xl font-bold mb-4 tracking-widest">
        {banner.title}
      </h1>
      <p className="text-xl">{banner.content}</p>
    </div>
  );
}
