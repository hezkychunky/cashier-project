'use client';

import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoCreateOutline, IoAddCircleOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import CreateProductModal from './components/createProductModal';
import EditProductModal from './components/editProductModal';
import DeleteProductModal from './components/deleteProductModal';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`${BASEURL}/api/product`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setProducts(data.data);
    };
    fetchProducts();
  }, []);

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
    <div className="flex flex-col items-center h-auto bg-[#fffaf0] text-gray-800 py-4 gap-4">
      <h1 className="font-bold">PRODUCT MANAGEMENT</h1>
      <div className="flex space-x-4">
        <button
          onClick={openCreateModal}
          className="flex bg-lime-500 items-center p-2 rounded-md h-10  hover:bg-lime-400"
        >
          Add Data
          <IoAddCircleOutline size={30} />
        </button>
        <select className="mb-4 border p-2 rounded bg-white">
          <option value="">All Categories</option>
          <option value="COFFEE">Coffee</option>
          <option value="TEA">Tea</option>
          <option value="CHOCOLATE">Chocolate</option>
        </select>
      </div>
      <table className="w-4/5 border-slate-700">
        <thead className="bg-orange-300 border-b">
          <tr>
            <th className="py-3 px-1 border-slate-700">ID</th>
            <th className="py-3 px-1 border-slate-700">Product Name</th>
            <th className="py-3 px-1 border-slate-700">Category</th>
            <th className="py-3 px-1 border-slate-700">Price (Rp)</th>
            <th className="py-3 px-1 border-slate-700">Stock</th>
            <th className="py-3 px-1 border-slate-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="text-center border-b">
              <td className="py-3 px-1 border-slate-700">{product.id}</td>
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
                    className="rounded-md border border-orange-500 p-2  hover:bg-orange-200"
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
