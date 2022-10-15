import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

import { Data } from '../posts';

export type Post = {
  data: Data;
  content: string;
};

const getPost = async (slug: string) => {
  const post = await fs.readFile(
    path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      '_posts',
      `${slug}.md`
    ),
    {
      encoding: 'utf8',
    }
  );

  const { content, data } = matter(post);

  return { content, data } as Post;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post>
) {
  const { slug } = req.query;

  const post = await getPost(slug as string);

  return res.status(200).json(post);
}
