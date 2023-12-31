import type { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import Header from '../components/Header';
import { getAllPosts } from '../../lib/posts';

type Props = {
  tags: string[];
};

const PostsPage: NextPage<Props> = ({ tags }) => {
  if (tags.length <= 0) {
    return (
      <div className="flex flex-col justify-center max-w-3xl mx-auto w-full px-4">
        <Head>
          <title>Samuel Durante Blog</title>
        </Head>

        <Header />

        <div className="divide-y">
          <h1 className="pt-10 pb-5 text-2xl">All tags:</h1>
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
        <h1 className="pt-10 pb-5 text-2xl">All tags:</h1>
        <div className="flex flex-wrap gap-3 py-4 whitespace-no-wrap">
          {tags.map((tag, key) => (
            <Link
              className="items-center rounded-lg bg-gray-900/10 py-1.5 px-3 font-sans text-xs font-bold uppercase text-gray-900"
              key={key}
              href={`/posts/tagged/${tag}`}
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostsPage;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = await getAllPosts();
  const tags = posts.flatMap((post) => post.metadata.tags);

  const uniqueTags = tags.filter((item, i) => tags.indexOf(item) === i);

  return {
    props: {
      tags: uniqueTags,
    },
  };
};
