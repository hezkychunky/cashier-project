import React from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';

type CartListProps = {
  cart: CartItem[];
  totalPrice: number;
  onRemoveFromCart: (name: string) => void;
};

export const CartList = ({
  cart,
  totalPrice,
  onRemoveFromCart,
}: CartListProps) => {
  return (
    <div>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li
                key={item.id}
                className="mb-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-orange-500">{item.name}</p>
                  <p>
                    {item.price.toLocaleString()} x {item.quantity} = Rp{' '}
                    {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => onRemoveFromCart(item.name)}
                  className="bg-orange-500 text-white px-3 py-1 rounded-lg hover:bg-orange-600"
                >
                  <RiDeleteBin6Line />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-lg font-semibold">
            Total: Rp {totalPrice.toLocaleString()}
          </div>
        </>
      )}
    </div>
  );
};
