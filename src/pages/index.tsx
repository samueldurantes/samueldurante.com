import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import Header from '../components/Header';
import { useFetch } from '../hooks/useFetch';

const Home: NextPage = () => {
  const { data } = useFetch('/api/posts');

  if (!data) {
    return (
      <div className="flex flex-col justify-center max-w-3xl mx-auto w-full px-4">
        <Head>
          <title>Blog</title>
        </Head>

        <Header />

        <div className="pt-10">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center max-w-3xl mx-auto w-full px-4">
      <Head>
        <title>Blog</title>
      </Head>

      <Header />

      <div className="divide-y">
        <h1 className='pt-10 pb-5 text-2xl font-bold'>
          Latest posts:
        </h1>
        {data.map((post: any, key: any) => (
          <div className="py-10" key={key}>
            <Link href={`/post/${post.slug}`}>
              <a className="text-xl underline">{post.title}</a>
            </Link>
            <p className="pt-4">{post.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
