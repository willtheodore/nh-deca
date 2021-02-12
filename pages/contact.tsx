import Head from "next/head";
import * as React from "react";
import Layout from "../components/layout";
import marked from "marked";
import { getPage } from "../utils/firestore";

export async function getStaticProps() {
  const page = await getPage("contact");
  const { content } = page ? page : { content: "" };
  const parsed = marked(content);

  return {
    props: {
      content: parsed,
    },
  };
}

interface ContactProps {
  content: string;
}
export default function Contact({ content }: ContactProps) {
  return (
    <>
      <Head>
        <title>Contact NH DECA</title>
      </Head>

      <Layout title="Contact" home="/images/highlight4.jpg">
        <div
          className="page-content-container"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Layout>
    </>
  );
}
