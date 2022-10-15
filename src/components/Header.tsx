import Link from 'next/link';

const Header = () => {
  const items = [
    {
      name: 'about',
      url: '/about',
    },
    {
      name: 'github',
      url: 'https://github.com/samueldurantes',
    },
    {
      name: 'twitter',
      url: 'https://twitter.com/samuel04693141',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-between pt-8 font-mono sm:flex-row">
      <Link href="/">
        <a className="text-lg">Samuel Durante</a>
      </Link>
      <div className="flex gap-2">
        {items.map((item, key) => (
          <>
            {key > 0 && key < items.length ? <span>/</span> : null}
            <Link key={key} href={item.url}>
              <a className="text-base underline">{item.name}</a>
            </Link>
          </>
        ))}
      </div>
    </div>
  );
};

export default Header;
