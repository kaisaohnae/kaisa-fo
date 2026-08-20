import Head from 'next/head';

export default function MetaTags() {
  return (
    <Head>
      <title>Kaisa</title>
      <meta charSet="utf-8"/>
      <meta name="robots" content="index, follow"/>
      <meta name="googlebot" content="index, follow"/>
      <meta name="description" content="Kaisa,가이사,카이사,가평,Kaisa Works"/>
      <meta name="keywords" content="Kaisa,가이사,카이사,가평,Kaisa Works"/>
      <meta name="author" content="AnySSign"/>
      <meta name="apple-mobile-web-app-title" content="에이나"/>
      <meta property="og:title" content="에이나"/>
      <meta property="og:description" content="Kaisa,가이사,카이사,가평,Kaisa Works"/>
      <meta property="og:image" content="/img/common/logo.png"/>
      <link rel="canonical" href="https://www.anyssign.com/"/>
      <link rel="shortcut icon" href="/img/common/favicon.ico"/>
      <link rel="apple-touch-icon" href="/img/common/favicon.ico"/>
      <meta name="viewport" content="initial-scale=1.0,minimum-scale=0,maximum-scale=1.0,user-scalable=no"/>
      <meta name="format-detection" content="telephone=no, address=no, email=no"/>
      <meta name="application-name" content="Kaisa"/>
    </Head>
  );
}
