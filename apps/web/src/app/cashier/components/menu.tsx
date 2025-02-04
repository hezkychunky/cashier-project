import React, { useState } from 'react';
import { ProductModal } from './productModal';
import Image from 'next/image';

type MenuProps = {
  productsData: Product[];
  onAddToCart: (item: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }) => void;
};

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

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
        {productsData.map((product) => {
          // Ensure correct image path
          let imageUrl = product.image;
          if (imageUrl?.startsWith('/uploads/')) {
            imageUrl = `${BASEURL}${imageUrl}`;
          } else if (!imageUrl) {
            imageUrl = '/default-product.png'; // Use a default placeholder image
          }

          return (
            <div
              key={product.id}
              className="border rounded-lg p-4 text-center shadow hover:shadow-md hover:bg-orange-500 cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <div className="relative h-30 w-full flex items-center justify-center">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={product.name!}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <span className="text-gray-500">No Image</span>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                    <span className="text-white text-lg font-bold">
                      SOLD OUT
                    </span>
                  </div>
                )}
              </div>
              <p className="font-medium">{product.name}</p>
              <p className="text-gray-800">{product.price?.toLocaleString()}</p>
            </div>
          );
        })}
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
