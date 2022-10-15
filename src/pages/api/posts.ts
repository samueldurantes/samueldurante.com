import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export type Data = {
  id: number;
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
};

const getAllPosts = async () => {
  const files: string[] = await fs.readdir(
    path.resolve(__dirname, '..', '..', '..', '..', '_posts')
  );

  const posts = await Promise.all(
    files.map(async (file) => {
      return await fs.readFile(
        path.resolve(__dirname, '..', '..', '..', '..', '_posts', file),
        {
          encoding: 'utf8',
        }
      );
    })
  );

  return posts.map((post) => {
    const { data } = matter(post);

    return data as Data;
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[]>
) {
  const posts = await getAllPosts();

  return res.status(200).json(posts);
}
