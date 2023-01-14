import type { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import Header from '../components/Header';
import { getAllPosts } from '../../lib/posts';
import type { Posts, Post } from '../../lib/posts';

type Props = {
  posts: Posts;
};

const Home: NextPage<Props> = ({ posts }) => {
  if (posts.length <= 0) {
    return (
      <div className="flex flex-col justify-center max-w-3xl mx-auto w-full px-4">
        <Head>
          <title>Blog</title>
        </Head>

        <Header />

        <div className="divide-y">
          <h1 className="pt-10 pb-5 text-2xl">Posts:</h1>
          <p className="py-10">No posts found.</p>
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
        <h1 className="pt-10 pb-5 text-2xl">Posts:</h1>
        {posts.map((post: Post, key: number) => (
          <div className="py-10" key={key}>
            <p className="text-sm" key={key}>
              {post.metadata.date}
            </p>
            <Link href={`/post/${post.metadata.slug}`}>
              <a className="underline text-xl text-blue-600 hover:text-blue-800 visited:text-purple-600">
                {post.metadata.title}
              </a>
            </Link>
            <div className="flex gap-1" key={key}>
              {post?.metadata?.tags?.map((tag: string, key: number) => (
                <p
                  className="italic text-sm font-serif"
                  key={key}
                >{`#${tag}`}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = await getAllPosts();

  return {
    props: {
      posts,
    },
  };
};
