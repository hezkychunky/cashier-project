'use client';

import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoCreateOutline, IoAddCircleOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CreateProductModal from './components/createProductModal';
import EditProductModal from './components/editProductModal';
import DeleteProductModal from './components/deleteProductModal';
import debounce from 'lodash.debounce';
import ResetFiltersButton from '@/components/ResetFiltersButton';
import PaginationControls from '@/components/PaginationControls';
import { fetchWithAuth } from '@/app/utils/fetchWithAuth';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function ProductManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const validSortOptions: ('asc' | 'desc')[] = ['asc', 'desc'];
  const sortParam = validSortOptions.includes(
    searchParams.get('sort') as 'asc' | 'desc',
  )
    ? (searchParams.get('sort') as 'asc' | 'desc')
    : 'asc';

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [selectedCategory, setSelectedCategory] =
    useState<string>(categoryParam);
  const [searchQuery, setSearchQuery] = useState<string>(searchParam);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    sortParam as 'asc' | 'desc',
  );
  const [debouncedSearch, setDebouncedSearch] = useState<string>(searchParam);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async (
    category: string,
    search: string,
    sort: 'asc' | 'desc',
    page: number,
  ) => {
    try {
      let queryParams = new URLSearchParams();
      if (category) queryParams.append('category', category);
      if (search) queryParams.append('search', search);
      if (sort) queryParams.append('sort', sort);
      queryParams.append('page', page.toString());

      const url = `${BASEURL}/api/product?${queryParams.toString()}`;

      const data = await fetchWithAuth(url);

      if (data) {
        setProducts(data.data);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const updateFilters = (
    category: string,
    search: string,
    sort: 'asc' | 'desc',
    page: number,
  ) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    params.set('sort', sort);
    params.set('page', page.toString());

    router.push(`?${params.toString()}`);
    fetchProducts(category, search, sort, page);
  };

  useEffect(() => {
    fetchProducts(
      searchParams.get('category') || '',
      searchParams.get('search') || '',
      sortParam,
      pageParam,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // Delay: 500ms

    handler();
    return () => handler.cancel();
  }, [searchQuery]);

  useEffect(() => {
    updateFilters(selectedCategory, debouncedSearch, sortOrder, 1);
  }, [debouncedSearch, selectedCategory, sortOrder]);

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const category = event.target.value;
    setSelectedCategory(category);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const refreshProducts = () => {
    fetchProducts(selectedCategory, debouncedSearch, sortOrder, pageParam);
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

  return (
    <div className="flex flex-col items-center h-auto bg-white text-gray-800 ml-20 py-4 gap-4">
      <h1 className="font-bold">PRODUCT MANAGEMENT</h1>

      <div className="flex space-x-4">
        <button
          onClick={openCreateModal}
          className="flex bg-lime-500 items-center p-2 rounded-md h-10 hover:bg-lime-400"
        >
          Add Data
          <IoAddCircleOutline size={30} />
        </button>

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

        <input
          type="text"
          placeholder="Search by Product Name..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="border p-2 rounded-lg bg-white border-orange-500"
        />

        <button
          onClick={handleSortChange}
          className="border p-2 rounded-lg bg-white border-orange-500 hover:bg-orange-500"
        >
          Sort by Stock ({sortOrder === 'asc' ? 'Low to High' : 'High to Low'})
        </button>
        <ResetFiltersButton />
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
      <PaginationControls totalPages={totalPages} currentPage={currentPage} />
      {/* Modals */}
      {isCreateModalOpen && (
        <CreateProductModal
          onClose={closeModal}
          refreshProducts={refreshProducts}
        />
      )}
      {isEditModalOpen && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={closeModal}
          refreshProducts={refreshProducts}
        />
      )}
      {isDeleteModalOpen && selectedProduct && (
        <DeleteProductModal
          product={selectedProduct}
          onClose={closeModal}
          refreshProducts={refreshProducts}
        />
      )}
    </div>
  );
}
