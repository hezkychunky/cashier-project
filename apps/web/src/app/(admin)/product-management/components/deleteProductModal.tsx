import { toast } from 'react-toastify';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function DeleteProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${BASEURL}/api/product/delete/${product.id}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      toast.success(`${product.name} deleted successfully!`);
      onClose();
    } catch (error) {
      toast.error(`Error deleting ${product.name}`);
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">Delete Product</h2>
        <p>Are you sure you want to delete {product.name}?</p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
