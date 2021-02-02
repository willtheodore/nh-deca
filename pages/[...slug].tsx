import { GetStaticPropsContext } from "next";
import Head from "next/head";
import * as React from "react";
import marked from "marked";
import Layout from "../components/layout";
import { getImageURL, getPage, getPagePaths } from "../utils/firestore";

interface PageProps {
  heroURL?: string | null;
  title: string;
  content: string;
}

export async function getStaticPaths() {
  const pathsArray = await getPagePaths();
  if (!pathsArray) return;
  const paths = pathsArray.map((slugArray) => {
    return {
      params: {
        slug: slugArray,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  if (!params) return;
  const rawSlug = params.slug as string[];
  const slug = rawSlug.reduce((prev, curr) => prev.concat(`\\${curr}`));
  const page = await getPage(slug);
  const { heroURL, title, content } = page
    ? page
    : { heroURL: null, title: "", content: "" };
  const mdParsed = marked(content);

  return {
    props: {
      heroURL,
      title,
      content: mdParsed,
    },
  };
}

export default function Page({ heroURL = null, title, content }: PageProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Layout hero={heroURL ? heroURL : undefined} title={title}>
        <div
          className="page-content-container"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Layout>
    </>
  );
}
