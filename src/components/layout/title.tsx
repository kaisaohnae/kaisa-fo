import Head from 'next/head';

export default function Title({title}: { title?: string }) {
  // let pageTitle = `${title ? title + ' | ' : ''} kaisa-fo`;
  let pageTitle = `Kaisa`;
  return (
    <Head>
      <title>{pageTitle}</title>
    </Head>
  );
}
