'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import Image from 'next/image';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function CreateProductModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [imageUploaded, setImageUploaded] = useState<boolean>(false); // ✅ Track if image upload is completed

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
          throw new Error(data.message || 'Failed to upload image.');

        // ✅ Ensure correct URL format
        const imagePath = data.filePath.startsWith('/uploads/')
          ? `${BASEURL}${data.filePath}`
          : data.filePath;

        setImageUrl(imagePath); // ✅ Absolute URL
        setImageUploaded(true);
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
    initialValues: { name: '', category: 'COFFEE', price: 0, stock: 0 },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      category: Yup.string().required('Category is required'),
      price: Yup.number()
        .min(0, 'Price must be non-negative')
        .required('Price is required'),
      stock: Yup.number()
        .min(0, 'Stock must be non-negative')
        .required('Stock is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch(`${BASEURL}/api/product`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...values, image: imageUrl }),
        });

        if (!response.ok) throw new Error('Failed to create product');
        toast.success('Product created successfully!');
        onClose();
      } catch (error) {
        toast.error('Error creating product.');
      }
    },
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">Create New Product</h2>
        <form onSubmit={formik.handleSubmit}>
          {/* Name */}
          <input
            type="text"
            placeholder="Name"
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
            placeholder="Price"
            className="p-2 border w-full mb-2"
            {...formik.getFieldProps('price')}
          />
          {formik.touched.price && formik.errors.price && (
            <div className="text-red-500 text-sm">{formik.errors.price}</div>
          )}

          {/* Stock */}
          <input
            type="number"
            placeholder="Stock"
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

          {/* Display Uploaded Image */}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Uploaded Image"
              width={128}
              height={128}
              className="w-32 mt-2 rounded-lg object-cover"
              unoptimized={true} // ✅ Bypass Next.js optimization for localhost images
            />
          )}

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded-md"
              disabled={
                formik.isSubmitting || !formik.isValid || !imageUploaded
              } // ✅ Fixed issue
            >
              Create
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
