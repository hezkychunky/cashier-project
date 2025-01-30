'use client';

import { Menu } from './components/menu';
import { Checkout } from './components/checkout';
import { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function Cashier() {
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchProducts = async (category: string, search: string) => {
    try {
      let queryParams = new URLSearchParams();
      if (category) queryParams.append('category', category);
      if (search) queryParams.append('search', search);

      const response = await fetch(
        `${BASEURL}/api/product?${queryParams.toString()}`,
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setProductsData(data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query) => {
      fetchProducts(selectedCategory, query);
    }, 500),
    [selectedCategory],
  );

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    fetchProducts(category, searchQuery);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  useEffect(() => {
    fetchProducts(selectedCategory, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.name === item.name,
      );
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem,
        );
      }
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

      setCart([]);
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  return (
    <div className="flex max-h-[565px] pl-14">
      <section className="w-3/4 bg-white shadow-lg p-4 rounded-lg ml-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Menu</h2>

        {/* Filters */}
        <div className="flex flex-wrap items-center space-x-4 mb-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by Product Name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="border p-2 rounded bg-white border-orange-500"
          />

          {/* Category Filter Buttons */}
          <div className="flex space-x-2">
            {['', 'COFFEE', 'CHOCOLATE', 'TEA'].map((category) => (
              <button
                key={category || 'ALL'}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-md border ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200'
                } hover:bg-orange-400`}
              >
                {category
                  ? category.charAt(0) + category.slice(1).toLowerCase()
                  : 'All'}
              </button>
            ))}
          </div>
        </div>

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
