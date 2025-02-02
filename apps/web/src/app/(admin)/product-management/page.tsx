'use client';

import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoCreateOutline, IoAddCircleOutline } from 'react-icons/io5';
import { useEffect, useState, useCallback } from 'react';
import CreateProductModal from './components/createProductModal';
import EditProductModal from './components/editProductModal';
import DeleteProductModal from './components/deleteProductModal';
import debounce from 'lodash.debounce'; // Import debounce function

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // State for filtering, searching, and sorting
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Fetch products with filters, search, and sorting
  const fetchProducts = async (
    category: string,
    search: string,
    sort: 'asc' | 'desc',
  ) => {
    try {
      let queryParams = new URLSearchParams();
      if (category) queryParams.append('category', category);
      if (search) queryParams.append('search', search);
      if (sort) queryParams.append('sort', sort);

      const response = await fetch(
        `${BASEURL}/api/product?${queryParams.toString()}`,
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setProducts(data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query) => {
      fetchProducts(selectedCategory, query, sortOrder);
    }, 1000),
    [selectedCategory, sortOrder],
  );

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const category = event.target.value;
    setSelectedCategory(category);
    fetchProducts(category, searchQuery, sortOrder);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSortChange = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    fetchProducts(selectedCategory, searchQuery, newSortOrder);
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };
  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };
  const closeModal = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    fetchProducts(selectedCategory, searchQuery, sortOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center h-auto bg-[#fffaf0] text-gray-800 ml-20 py-4 gap-4">
      <h1 className="font-bold">PRODUCT MANAGEMENT</h1>
      <div className="flex space-x-4">
        <button
          onClick={openCreateModal}
          className="flex bg-lime-500 items-center p-2 rounded-md h-10 hover:bg-lime-400"
        >
          Add Data
          <IoAddCircleOutline size={30} />
        </button>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border p-2 rounded-lg bg-white border-orange-500"
        >
          <option value="">All Categories</option>
          <option value="COFFEE">Coffee</option>
          <option value="TEA">Tea</option>
          <option value="CHOCOLATE">Chocolate</option>
        </select>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by Product Name..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="border p-2 rounded-lg bg-white border-orange-500"
        />

        {/* Sorting Button */}
        <button
          onClick={handleSortChange}
          className="border p-2 rounded-lg bg-white border-orange-500 hover:bg-orange-500"
        >
          Sort by Stock ({sortOrder === 'asc' ? 'Low to High' : 'High to Low'})
        </button>
      </div>

      <table className="w-4/5 border-slate-700">
        <thead className="bg-orange-300 border-b">
          <tr>
            <th className="py-3 px-1 border-slate-700">No</th>
            <th className="py-3 px-1 border-slate-700">Product Name</th>
            <th className="py-3 px-1 border-slate-700">Category</th>
            <th className="py-3 px-1 border-slate-700">Price (Rp)</th>
            <th className="py-3 px-1 border-slate-700">Stock</th>
            <th className="py-3 px-1 border-slate-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id} className="text-center border-b">
              <td className="py-3 px-1 border-slate-700">{index + 1}</td>
              <td className="py-3 px-1 border-slate-700">{product.name}</td>
              <td className="py-3 px-1 border-slate-700">{product.category}</td>
              <td className="py-3 px-1 border-slate-700">{product.price}</td>
              <td className="py-3 px-1 border-slate-700">{product.stock}</td>
              <td>
                <div className="flex gap-1 justify-center">
                  <button
                    onClick={() => openEditModal(product)}
                    className="rounded-md border border-orange-500 p-2 hover:bg-orange-200"
                  >
                    <IoCreateOutline />
                  </button>
                  <button
                    onClick={() => openDeleteModal(product)}
                    className="rounded-md border border-orange-500 p-2 hover:bg-orange-200"
                  >
                    <RiDeleteBin6Line />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modals */}
      {isCreateModalOpen && <CreateProductModal onClose={closeModal} />}
      {isEditModalOpen && selectedProduct && (
        <EditProductModal product={selectedProduct} onClose={closeModal} />
      )}
      {isDeleteModalOpen && selectedProduct && (
        <DeleteProductModal product={selectedProduct} onClose={closeModal} />
      )}
    </div>
  );
}
