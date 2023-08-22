/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import Header from '../components/Header';

const About: NextPage = () => {
  const age = ~~(
    (Date.now() - +new Date('2004-11-26T00:00:00.000Z')) /
    31557600000
  );

  const links = [
    {
      name: 'twitter',
      url: 'https://twitter.com/samueldurantes',
    },
    {
      name: 'github',
      url: 'https://github.com/samueldurantes',
    },
    {
      name: 'devto',
      url: 'https://dev.to/samueldurante',
    },
  ];

  return (
    <div className="flex flex-col justify-center max-w-3xl mx-auto w-full px-4">
      <Head>
        <title>Samuel Durante Blog - About</title>
      </Head>

      <Header />

      <div className="flex flex-col pt-10 gap-4 sm:flex-row">
        <img
          src="https://avatars.githubusercontent.com/u/44513615"
          alt="avatar"
        />
        <div className="flex flex-col gap-4">
          <p>
            {`My name is Samuel, I am ${age} years old and currently studying Electrical Engineering. My interests include math, programming language theory, functional programming, and self-driving cars. I am currently working in web development. In my free time, I enjoy learning more about programming and working on personal projects related to my interests.`}
          </p>
          <div className="flex gap-2">
            <p>Reach me on:</p>
            {links.map((link, key) => (
              <div key={key} className="flex gap-2">
                {key > 0 && key < links.length ? <span>/</span> : null}
                <Link
                  className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                  href={link.url}
                  target="_blank"
                >
                  {link.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
