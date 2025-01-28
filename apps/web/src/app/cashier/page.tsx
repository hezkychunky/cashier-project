'use client';

import { Menu } from './components/menu';
import { Checkout } from './components/checkout';
import { useEffect, useState } from 'react';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function Cashier() {
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch(`${BASEURL}/api/product`);
      const data = await response.json();
      console.log(data);
      setProductsData(data.data);
    }
    fetchProducts();
  }, []);

  const handleAddToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.name === item.name,
      );
      if (existingItem) {
        // Update quantity if item already exists in the cart
        return prevCart.map((cartItem) =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem,
        );
      }
      // Add new item to the cart
      return [...prevCart, item];
    });
  };

  const handleRemoveFromCart = (name: string) => {
    setCart((prevCart) =>
      prevCart.filter((cartItem) => cartItem.name !== name),
    );
  };

  const handleOnSubmit = async (
    paymentMethod: 'CASH' | 'DEBIT',
    paymentDetails: { cardNumber?: string; cashReceived?: string },
  ) => {
    const orderData = {
      shiftId: 2, // Replace with the current active shift ID
      cart: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      paymentMethod,
      paymentDetails,
      totalPrice: cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
    };

    try {
      const response = await fetch(`${BASEURL}/api/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the order.');
      }

      const result = await response.json();
      console.log('Order submitted successfully:', result);

      // Clear the cart after successful submission
      setCart([]);
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  return (
    <div className="flex max-h-[565px] pl-14">
      <section className="w-3/4 bg-white shadow-lg p-4 rounded-lg ml-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Menu</h2>
        <Menu productsData={productsData} onAddToCart={handleAddToCart} />
      </section>
      <section className="w-1/4 bg-white shadow-lg p-4 rounded-lg overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Checkout</h2>
        <Checkout
          cart={cart}
          onRemoveFromCart={handleRemoveFromCart}
          onSubmit={handleOnSubmit}
        />
      </section>
    </div>
  );
}
