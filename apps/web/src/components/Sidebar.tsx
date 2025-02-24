'use client';

import { AiOutlineDollar } from 'react-icons/ai';
import { GrUserSettings } from 'react-icons/gr';
import { GiCoffeeCup } from 'react-icons/gi';
import { FaCashRegister } from 'react-icons/fa';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export const Sidebar = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(Cookies.get('userRole') || null);
  }, []);

  return (
    <aside className="bg-orange-500 text-white h-screen fixed p-3 flex flex-col justify-center gap-4 border-r-2 border-white z-30">
      {userRole === 'CASHIER' && (
        <div className="flex flex-col gap-8">
          <Link href={'/cashier'}>
            <button className="flex w-12 justify-center items-center gap-2 bg-white text-orange-500 px-2 py-2 rounded font-medium hover:bg-orange-100">
              <FaCashRegister size={28} />
            </button>
          </Link>
          <Link href={'/sales-cashier'}>
            <button className="flex w-12 justify-center items-center gap-2 bg-white text-orange-500 px-2 py-2 rounded font-medium hover:bg-orange-100">
              <AiOutlineDollar size={30} />
            </button>
          </Link>
        </div>
      )}

      {userRole === 'ADMIN' && (
        <div className="flex flex-col gap-8">
          <Link href={'/sales-admin'}>
            <button className="flex w-12 justify-center items-center gap-2 bg-white text-orange-500 px-2 py-2 rounded font-medium hover:bg-orange-100">
              <AiOutlineDollar size={30} />
            </button>
          </Link>
          <Link href={'/account-management'}>
            <button className="flex w-12 justify-center items-center gap-2 bg-white text-orange-500 px-2 py-3 rounded font-medium hover:bg-orange-100">
              <GrUserSettings size={25} />
            </button>
          </Link>
          <Link href={'/product-management'}>
            <button className="flex w-12 justify-center items-center gap-2 bg-white text-orange-500 px-2 py-3 rounded font-medium hover:bg-orange-100">
              <GiCoffeeCup size={25} />
            </button>
          </Link>
        </div>
      )}
    </aside>
  );
};
