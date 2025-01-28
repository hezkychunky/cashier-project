import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function CreateProductModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const formik = useFormik({
    initialValues: {
      name: '',
      category: 'COFFEE',
      price: 0,
      stock: 0,
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
        const response = await fetch(`${BASEURL}/api/product`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to create product');
        }

        toast.success('Product created successfully!');
        onClose();
      } catch (error) {
        toast.error('Error creating product');
        console.error('Error creating product:', error);
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">Create New Product</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-2">
            <input
              name="name"
              type="text"
              placeholder="Name"
              className="p-2 border w-full"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-sm">{formik.errors.name}</div>
            )}
          </div>

          <div className="mb-2">
            <select
              name="category"
              className="p-2 border w-full"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="COFFEE">Coffee</option>
              <option value="TEA">Tea</option>
              <option value="CHOCOLATE">Chocolate</option>
            </select>
            {formik.touched.category && formik.errors.category && (
              <div className="text-red-500 text-sm">
                {formik.errors.category}
              </div>
            )}
          </div>

          <div className="mb-2">
            <input
              name="price"
              type="number"
              placeholder="Price"
              className="p-2 border w-full"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.price && formik.errors.price && (
              <div className="text-red-500 text-sm">{formik.errors.price}</div>
            )}
          </div>

          <div className="mb-2">
            <input
              name="stock"
              type="number"
              placeholder="Stock"
              className="p-2 border w-full"
              value={formik.values.stock}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.stock && formik.errors.stock && (
              <div className="text-red-500 text-sm">{formik.errors.stock}</div>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded-md"
              disabled={formik.isSubmitting || !formik.isValid}
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
