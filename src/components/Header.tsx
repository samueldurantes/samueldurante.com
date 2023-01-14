import Link from 'next/link';

const Header = () => {
  const items = [
    {
      name: 'About',
      url: '/about',
    },
  ];

  return (
    <div className="flex flex-row items-center justify-between pt-8">
      <Link href="/">
        <a className="text-2xl hover:underline">λSamuel. Durante</a>
      </Link>
      <div className="flex gap-2">
        {items.map((item, key) => (
          <>
            {key > 0 && key < items.length ? <span>/</span> : null}
            <Link key={key} href={item.url}>
              <a className="text-base hover:underline">{item.name}</a>
            </Link>
          </>
        ))}
      </div>
    </div>
  );
};

export default Header;
