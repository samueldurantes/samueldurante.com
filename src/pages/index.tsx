import type { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import moment from 'moment';

import Header from '../components/Header';
import { getAllPosts } from '../../lib/posts';
import type { Posts, Post } from '../../lib/posts';

type Props = {
  posts: Posts;
};

const Home: NextPage<Props> = ({ posts: _posts }) => {
  const posts = _posts.sort((a, b) => {
    if (a.metadata.created_at < b.metadata.created_at) {
      return 1;
    }

    if (a.metadata.created_at > b.metadata.created_at) {
      return -1;
    }

    return 0;
  });

  if (posts.length <= 0) {
    return (
      <div className="flex flex-col justify-center max-w-3xl mx-auto w-full px-4">
        <Head>
          <title>Samuel Durante Blog</title>
        </Head>

        <Header />

        <div className="divide-y">
          <h1 className="pt-10 pb-5 text-2xl">Posts:</h1>
          <p className="py-4">No posts found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center max-w-3xl mx-auto w-full px-4">
      <Head>
        <title>Samuel Durante Blog</title>

        <meta name="description" content="Blog" />
      </Head>

      <Header />

      <div className="divide-y">
        <h1 className="pt-10 pb-5 text-2xl">Posts:</h1>
        {posts.slice(0, 4).map((post: Post, key: number) => (
          <div className="flex flex-col gap-1 py-10" key={key}>
            <p className="text-sm" key={key}>
              {moment(post.metadata.created_at).format('ll')}
            </p>
            <Link
              className="text-xl text-blue-800 hover:underline"
              href={`/post/${post.metadata.slug}`}
            >
              {post.metadata.title}
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
        <div className="flex justify-center">
          <Link
            className="text-sm text-blue-800 hover:underline py-4"
            href="/posts"
          >
            See all posts
          </Link>
        </div>
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
