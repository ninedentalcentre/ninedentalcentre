// src/pages/_app.js
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/images/favicon.png" type="image/png" />
        <title>Nine Dental Centre</title> {/* optional */}
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
