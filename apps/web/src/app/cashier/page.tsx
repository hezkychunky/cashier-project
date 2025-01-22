'use client';

import { Menu } from './components/menu';
import { Checkout } from './components/checkout';

export default function Cashier() {
  return (
    <div className="flex max-h-[565px] pl-14">
      {/* Products Section (3/4 width) */}
      <section className="w-3/4 bg-white shadow-lg p-4 rounded-lg ml-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Menu</h2>
        <Menu />
      </section>
      {/* Cart Section (1/4 width) */}
      <section className="w-1/4 bg-white shadow-lg p-4 rounded-lg overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Checkout</h2>
        <Checkout />
      </section>
    </div>
  );
}
