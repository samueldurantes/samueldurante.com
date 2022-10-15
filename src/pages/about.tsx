import type { NextPage } from 'next';
import Head from 'next/head';

import Header from '../components/Header';

const About: NextPage = () => {
  return (
    <div className="flex flex-col justify-center max-w-3xl mx-auto w-full px-4">
      <Head>
        <title>Blog</title>
      </Head>

      <Header />

      <div className="pt-10">
        <p>:)</p>
      </div>
    </div>
  );
};

export default About;
