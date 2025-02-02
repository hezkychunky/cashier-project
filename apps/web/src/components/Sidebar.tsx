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
    <aside className="bg-orange-500 text-white h-screen fixed p-4 flex flex-col gap-4 border-r-2 border-white z-30">
      <div className="flex items-center justify-center mb-24 pt-1">
        <h1 className="text-3xl font-extrabold">
          B<span className="text-gray-800">C</span>
        </h1>
      </div>

      {/* Render Cashier Links only for CASHIER users */}
      {userRole === 'CASHIER' && (
        <div className="flex flex-col gap-4">
          <Link href={'/cashier'}>
            <button className="flex w-12 justify-center items-center gap-2 bg-white text-orange-500 px-2 py-1 rounded font-medium hover:bg-orange-100">
              <FaCashRegister size={28} />
            </button>
          </Link>
          <Link href={'/sales-cashier'}>
            <button className="flex w-12 justify-center items-center gap-2 bg-white text-orange-500 px-2 py-1 rounded font-medium hover:bg-orange-100">
              <AiOutlineDollar size={30} />
            </button>
          </Link>
        </div>
      )}

      {/* Render Admin Links only for ADMIN users */}
      {userRole === 'ADMIN' && (
        <div className="flex flex-col gap-4">
          <Link href={'/sales-admin'}>
            <button className="flex w-12 justify-center items-center gap-2 bg-white text-orange-500 px-2 py-1 rounded font-medium hover:bg-orange-100">
              <AiOutlineDollar size={30} />
            </button>
          </Link>
          <Link href={'/account-management'}>
            <button className="flex w-12 justify-center items-center gap-2 bg-white text-orange-500 px-2 py-2 rounded font-medium hover:bg-orange-100">
              <GrUserSettings size={20} />
            </button>
          </Link>
          <Link href={'/product-management'}>
            <button className="flex w-12 justify-center items-center gap-2 bg-white text-orange-500 px-2 py-2 rounded font-medium hover:bg-orange-100">
              <GiCoffeeCup size={20} />
            </button>
          </Link>
        </div>
      )}
    </aside>
  );
};
