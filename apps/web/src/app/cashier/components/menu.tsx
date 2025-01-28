import React, { useState } from 'react';
import { ProductModal } from './productModal';

type MenuProps = {
  productsData: Product[];
  onAddToCart: (item: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }) => void;
};

export const Menu = ({ productsData, onAddToCart }: MenuProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      onAddToCart({
        id: selectedProduct.id,
        name: selectedProduct.name!,
        price: selectedProduct.price ?? 0,
        quantity,
      });
    }
    closeModal();
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        {productsData.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 text-center shadow hover:shadow-md hover:bg-gray-50 cursor-pointer"
            onClick={() => handleProductClick(product)}
          >
            <div className="h-20 bg-gray-200 mb-2" />
            <p className="font-medium">{product.name}</p>
            <p className="text-gray-500">{product.price?.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <ProductModal
        product={selectedProduct}
        quantity={quantity}
        onClose={closeModal}
        onQuantityChange={setQuantity}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};
