import { AppProps } from "next/dist/next-server/lib/router/router";
import Head from "next/head";
import * as React from "react";
import "../styles/globals.css";
import { AuthProvider, initializeAuthState, User } from "../utils/auth";

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    initializeAuthState(setUser);
  }, []);

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      <AuthProvider value={user}>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}

export default MyApp;
