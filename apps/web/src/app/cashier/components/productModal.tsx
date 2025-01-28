import React from 'react';

type ProductModalProps = {
  product: Product | null;
  quantity: number;
  onClose: () => void;
  onQuantityChange: (newQuantity: number) => void;
  onAddToCart: () => void;
};

export const ProductModal = ({
  product,
  quantity,
  onClose,
  onQuantityChange,
  onAddToCart,
}: ProductModalProps) => {
  if (!product) return null;

  // Ensure product.stock is treated as a number
  const stock = Number(product.stock) || 0; // Convert to number, fallback to 0 if null/undefined

  // Ensure the quantity doesn't exceed stock
  const handleIncrease = () => {
    if (quantity < stock) {
      onQuantityChange(quantity + 1);
    }
  };

  // Ensure the quantity doesn't go below 1
  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(Math.max(quantity - 1, 1));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">{product.name}</h2>
        <p className="text-gray-500 mb-4">Rp {product.price}</p>
        <p
          className={`${stock === 0 ? 'text-red-500 mb-4 font-bold text-center' : 'text-gray-500 mb-4'}`}
        >
          Stock: {stock}
        </p>
        {stock > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <button
                className="bg-gray-200 px-3 py-1 rounded"
                onClick={handleDecrease}
                disabled={quantity <= 1} // Disable if quantity is 1
              >
                -
              </button>
              <span className="text-lg">{quantity}</span>
              <button
                className="bg-gray-200 px-3 py-1 rounded"
                onClick={handleIncrease}
                disabled={quantity >= stock} // Disable if quantity reaches stock
              >
                +
              </button>
            </div>
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded w-full"
              onClick={onAddToCart}
            >
              Add to Cart
            </button>
          </>
        )}
        <button className="mt-4 text-sm underline w-full" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};
