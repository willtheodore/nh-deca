import Head from "next/head";
import "../styles/globals.css";
import Layout from "../components/layout";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      <Layout hero="/images/hero.png">
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
