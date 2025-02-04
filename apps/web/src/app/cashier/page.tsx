'use client';

import { Menu } from './components/menu';
import { Checkout } from './components/checkout';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import debounce from 'lodash.debounce';
import Cookies from 'js-cookie';
import { useAuth } from '@/app/context/authContext';
import { fetchWithAuth } from '../utils/fetchWithAuth';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function Cashier() {
  const { shift, fetchActiveShift } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ Read filter params from URL
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  const [productsData, setProductsData] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<string>(categoryParam);
  const [searchQuery, setSearchQuery] = useState<string>(searchParam);
  const [loading, setLoading] = useState(true);

  // ✅ Sync shift state from Cookies on mount
  useEffect(() => {
    const storedShift = Cookies.get('activeShift');
    if (storedShift) {
      fetchActiveShift().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchActiveShift]);

  const fetchProducts = async (category: string, search: string) => {
    try {
      let queryParams = new URLSearchParams();
      if (category) queryParams.append('category', category);
      if (search) queryParams.append('search', search);

      const data = await fetchWithAuth(
        `${BASEURL}/api/product/menu?${queryParams.toString()}`,
      );

      if (data) {
        setProductsData(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // ✅ Update URL params without reloading the page
  const updateURLParams = (category: string, search: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      fetchProducts(selectedCategory, query);
      updateURLParams(selectedCategory, query);
    }, 500),
    [selectedCategory], // ✅ Ensure latest category is used
  );

  // ✅ Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateURLParams(category, searchQuery);
    fetchProducts(category, searchQuery);
  };

  // ✅ Handle search input change with debounce
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  useEffect(() => {
    fetchProducts(selectedCategory, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

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
    if (!shift) {
      console.error('No active shift detected.');
      return;
    }

    const orderData = {
      shiftId: shift.id,
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
      // ✅ Use fetchWithAuth for authenticated API requests
      const result = await fetchWithAuth(`${BASEURL}/api/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!result || !result.success) {
        throw new Error('Failed to submit the order.');
      }

      console.log('Order submitted successfully:', result);
      setCart([]); // ✅ Clear cart after successful order
    } catch (error) {
      console.error('Error submitting order:', error);
    }

    fetchProducts(selectedCategory, searchQuery); // ✅ Re-fetch products after submission
  };

  return (
    <div className="flex max-h-[565px] pl-14">
      <section className="w-3/4 bg-white shadow-lg p-4 rounded-lg ml-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Menu</h2>

        {/* ✅ Show loading state until shift data is retrieved */}
        {loading ? (
          <p className="text-gray-500 font-semibold text-center py-4">
            Loading data...
          </p>
        ) : !shift ? (
          <p className="text-red-500 font-semibold text-center py-4 h-96">
            Please start the shift first to begin transactions.
          </p>
        ) : (
          <>
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

            {/* ✅ Only display menu when shift is active */}
            <Menu productsData={productsData} onAddToCart={handleAddToCart} />
          </>
        )}
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
