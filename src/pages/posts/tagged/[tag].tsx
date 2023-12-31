import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import moment from 'moment';

import { getAllPosts } from '../../../../lib/posts';
import type { Post, Post as PostType } from '../../../../lib/posts';
import Header from '../../../components/Header';

type Props = {
  posts: PostType[];
  tag: string;
};

type QueryParams = {
  tag?: string;
};

const Tag: NextPage<Props> = ({ posts, tag }) => {
  if (!posts || posts.length <= 0) {
    return (
      <div className="flex flex-col justify-center max-w-3xl mx-auto w-full px-4">
        <Head>
          <title>Samuel Durante Blog</title>
        </Head>

        <Header />

        <div className="divide-y">
          <h1 className="pt-10 pb-5 text-2xl">{`Posts tagged: "${tag}"`}</h1>
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
        <h1 className="pt-10 pb-5 text-2xl">{`Posts tagged: "${tag}"`}</h1>
        {posts.map((post: Post, key: number) => (
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
      </div>
    </div>
  );
};

export default Tag;

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts();

  const tags = posts.flatMap((post) => post.metadata.tags);
  const uniqueTags = tags.filter((item, i) => tags.indexOf(item) === i);

  const paths = uniqueTags.map((tag) => ({ params: { tag } }));

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps<Props, QueryParams> = async ({
  params,
}) => {
  const tag = params?.tag as string;

  const posts = await getAllPosts();
  const filteredPosts = posts.filter((post) =>
    post.metadata.tags.includes(tag)
  );

  return {
    props: {
      posts: filteredPosts,
      tag,
    },
  };
};
