import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import Header from '../../components/Header';
import { useFetch } from '../../hooks/useFetch';

const Post: NextPage = () => {
  const router = useRouter();
  const { data } = useFetch(`/api/post/${router.query.slug}`);

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

      <div className="pt-10">
        <h1 className="text-4xl font-bold font-serif">{data.data.title}</h1>
        <div className="flex gap-1 pt-2">
          {data.data.tags.map((tag: any, key: any) => (
            <p className="italic text-sm font-serif" key={key}>{`#${tag}`}</p>
          ))}
        </div>

        <div className="pt-6">
          <Markdown
            components={{
              h1: ({ children }) => (
                <h1 className="my-4 text-4xl font-bold">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="my-4 text-2xl font-bold">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="my-4 text-xl font-bold">{children}</h3>
              ),
              h4: ({ children }) => (
                <h4 className="my-4 text-lg font-bold">{children}</h4>
              ),
              p: ({ children }) => <p className="my-4">{children}</p>,
              code: ({ children, className }) => {
                const language = className?.split('-')[1];

                return language ? (
                  <SyntaxHighlighter language={language}>
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className='bg-gray-100 p-1 rounded'>{children}</code>
                );
              },
            }}
          >
            {data.content}
          </Markdown>
        </div>
      </div>
    </div>
  );
};

export default Post;
