'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import Image from 'next/image';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function EditProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  // ✅ Initial image state with existing product image
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(
    product.image ? product.image : null,
  );
  const [uploading, setUploading] = useState<boolean>(false);
  const [imageUploaded, setImageUploaded] = useState<boolean>(false); // Track if new image is uploaded

  // ✅ Handle File Upload
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        setUploading(true);
        const response = await fetch(`${BASEURL}/api/product/upload`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (!response.ok || !data.filePath)
          throw new Error('Failed to upload image.');

        setImageUrl(`${data.filePath}`); // ✅ Update the state with new image URL
        setImageUploaded(true); // ✅ Mark that a new image was uploaded
        toast.success('Image uploaded successfully!');
      } catch (error) {
        toast.error('Failed to upload image.');
      } finally {
        setUploading(false);
      }
    }
  };

  // ✅ Form Submission
  const formik = useFormik({
    initialValues: {
      name: product.name || '',
      category: product.category || 'COFFEE',
      price: product.price || 0,
      stock: product.stock || 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      category: Yup.string().required('Category is required'),
      price: Yup.number()
        .min(0, 'Price must be a non-negative number')
        .required('Price is required'),
      stock: Yup.number()
        .min(0, 'Stock must be a non-negative number')
        .required('Stock is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch(`${BASEURL}/api/product/${product.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...values,
            image: imageUrl, // ✅ Include the updated image URL
          }),
        });

        if (!response.ok) throw new Error('Failed to update product');

        toast.success('Product updated successfully!');
        onClose();
      } catch (error) {
        toast.error('Error updating product.');
      }
    },
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">Edit Product</h2>
        <form onSubmit={formik.handleSubmit}>
          {/* Name */}
          <input
            type="text"
            className="p-2 border w-full mb-2"
            {...formik.getFieldProps('name')}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-sm">{formik.errors.name}</div>
          )}

          {/* Category */}
          <select
            className="p-2 border w-full mb-2"
            {...formik.getFieldProps('category')}
          >
            <option value="COFFEE">Coffee</option>
            <option value="TEA">Tea</option>
            <option value="CHOCOLATE">Chocolate</option>
          </select>

          {/* Price */}
          <input
            type="number"
            className="p-2 border w-full mb-2"
            {...formik.getFieldProps('price')}
          />
          {formik.touched.price && formik.errors.price && (
            <div className="text-red-500 text-sm">{formik.errors.price}</div>
          )}

          {/* Stock */}
          <input
            type="number"
            className="p-2 border w-full mb-2"
            {...formik.getFieldProps('stock')}
          />
          {formik.touched.stock && formik.errors.stock && (
            <div className="text-red-500 text-sm">{formik.errors.stock}</div>
          )}

          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-2"
          />
          {uploading && <p className="text-blue-500">Uploading image...</p>}

          {/* Image Preview */}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Product Image"
              width={128}
              height={128}
              className="w-32 mt-2 rounded-lg object-cover"
            />
          )}

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded-md"
            >
              Update
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
