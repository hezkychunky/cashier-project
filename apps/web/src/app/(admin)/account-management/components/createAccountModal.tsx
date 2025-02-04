import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { fetchWithAuth } from '@/app/utils/fetchWithAuth';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function CreateUserModal({
  onClose,
  refreshUsers,
}: {
  onClose: () => void;
  refreshUsers: () => void;
}) {
  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      role: 'ADMIN',
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Full name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      role: Yup.string().required('Role is required'),
    }),
    onSubmit: async (values) => {
      try {
        // ✅ Use fetchWithAuth for authenticated API requests
        const data = await fetchWithAuth(`${BASEURL}/api/user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        if (!data || !data.success) {
          throw new Error('Failed to create user');
        }

        toast.success('User created successfully!');
        refreshUsers();
        onClose();
      } catch (error) {
        toast.error('Error creating user');
        console.error('Error creating user:', error);
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">Create New User</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-2">
            <input
              name="fullName"
              type="text"
              placeholder="Full Name"
              className="p-2 border w-full"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.fullName && formik.errors.fullName && (
              <div className="text-red-500 text-sm">
                {formik.errors.fullName}
              </div>
            )}
          </div>

          <div className="mb-2">
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="p-2 border w-full"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            )}
          </div>

          <div className="mb-2">
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="p-2 border w-full"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm">
                {formik.errors.password}
              </div>
            )}
          </div>

          <div className="mb-2">
            <select
              name="role"
              className="p-2 border w-full"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="ADMIN">Admin</option>
              <option value="CASHIER">Cashier</option>
            </select>
            {formik.touched.role && formik.errors.role && (
              <div className="text-red-500 text-sm">{formik.errors.role}</div>
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
