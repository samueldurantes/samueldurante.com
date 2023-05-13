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
      <Link className="text-2xl hover:underline" href="/">
        λSamuel. Durante
      </Link>
      <div className="flex gap-2">
        {items.map((item, key) => (
          <div key={key}>
            {key > 0 && key < items.length ? <span>/</span> : null}
            <Link className="text-base hover:underline" href={item.url}>
              {item.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;
