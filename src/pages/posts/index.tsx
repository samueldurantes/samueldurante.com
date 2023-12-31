import type { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import moment from 'moment';

import Header from '../../components/Header';
import { getAllPosts } from '../../../lib/posts';
import type { Posts, Post } from '../../../lib/posts';

type Props = {
  posts: Posts;
};

const PostsPage: NextPage<Props> = ({ posts: _posts }) => {
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
          <h1 className="pt-10 pb-5 text-2xl">All posts:</h1>
          <p className="py-4">No posts found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center max-w-3xl mx-auto w-full px-4">
      <Head>
        <title>Samuel Durante Blog</title>
      </Head>

      <Header />

      <div className="divide-y">
        <h1 className="pt-10 pb-5 text-2xl">All posts:</h1>
        <div className="flex flex-col gap-3 py-4">
          {posts.map((post: Post, key: number) => (
            <div key={key} className="flex gap-2 items-center">
              <span className="text-sm text-gray-600">
                ({moment(post.metadata.created_at).format('ll')})
              </span>
              <Link
                className="text-base text-blue-800 hover:underline"
                href={`/post/${post.metadata.slug}`}
              >
                {post.metadata.title}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostsPage;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = await getAllPosts();

  return {
    props: {
      posts,
    },
  };
};
