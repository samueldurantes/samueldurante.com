import path from 'path';
import fs from 'fs/promises';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), '_posts');

export type PostMetadata = {
  id: string;
  title: string;
  date: string;
  slug: string;
  tags: string[];
  devto?: string;
  draft?: boolean;
};

export type Post = {
  content: string;
  metadata: PostMetadata;
};

export type Posts = Post[];

const listPostsOnFolder = async () => {
  const posts = await fs.readdir(postsDirectory);

  let mds: string[] = [];

  for (const post of posts) {
    const postPath = path.join(postsDirectory, post);

    const md = await fs.readFile(postPath, { encoding: 'utf8' });

    mds = [...mds, md];
  }

  return mds;
};

const parseWithMatter = (rawString: string[]): Posts =>
  rawString
    .map((raw) => matter(raw))
    .filter((post) => !post.data.draft)
    .map(({ content, data }) => ({ content, metadata: data })) as Posts;

export const getAllPosts = async (): Promise<Posts> => {
  const rawPosts = await listPostsOnFolder();

  const matteredPosts = parseWithMatter(rawPosts);

  return matteredPosts;
};

export const getPostBySlug = async (slug?: string) => {
  const posts = await getAllPosts();

  const foundPost = posts.find((post) => post.metadata.slug === slug);

  return foundPost;
};
