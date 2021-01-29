import Head from "next/head";
import Layout from "../components/layout";

export default function Home() {
	return (
		<>
			<Head>
				<title>NH DECA</title>
			</Head>

			<Layout hero="images/hero.png">
				<h1 className="size-6xl weight-bold">TITLE</h1>
			</Layout>
		</>
	);
}
