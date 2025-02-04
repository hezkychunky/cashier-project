import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { fetchWithAuth } from '@/app/utils/fetchWithAuth';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function EditUserModal({
  user,
  onClose,
  refreshUsers,
}: {
  user: User;
  onClose: () => void;
  refreshUsers: () => void;
}) {
  const formik = useFormik({
    initialValues: {
      fullName: user.fullName || '',
      email: user.email || '',
      role: user.role || 'ADMIN',
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Full name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      role: Yup.string().required('Role is required'),
    }),
    onSubmit: async (values) => {
      try {
        const data = await fetchWithAuth(`${BASEURL}/api/user/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        if (!data || !data.success) {
          throw new Error('Failed to update user');
        }

        toast.success('User updated successfully!');
        refreshUsers();
        onClose();
      } catch (error) {
        toast.error('Error updating user');
        console.error('Error updating user:', error);
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-2">
            <label>Full Name: </label>
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
            <label>Email: </label>
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
            <label>Role: </label>
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
