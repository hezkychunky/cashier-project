import Link from 'next/link';

export const Header = () => {
  return (
    <header className="bg-orange-500 text-white p-4 flex justify-between items-center sticky top-0 z-30">
      <div className="flex-1 text-center pl-52 font-bold text-3xl">
        BETTER<span className="text-gray-800"> CASHIER</span>
      </div>
      <div className="flex gap-2">
        <button className="bg-white text-orange-500 px-2 w-24 py-2 rounded font-medium hover:bg-orange-100">
          Start Shift
        </button>
        <Link href={'/login'}>
          <button className="bg-white text-orange-500 px-2 w-24 py-2 rounded font-medium hover:bg-orange-100">
            Logout
          </button>
        </Link>
      </div>
    </header>
  );
};
