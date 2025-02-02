'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';

interface EndShiftModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (endCash: number) => void;
}

export const EndShiftModal: React.FC<EndShiftModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
}) => {
  // Formik setup for validation
  const formik = useFormik({
    initialValues: {
      endCash: '',
    },
    validationSchema: Yup.object({
      endCash: Yup.number()
        .typeError('Please enter a valid number')
        .min(10000, 'Minimum amount is Rp 10,000')
        .required('End cash amount is required'),
    }),
    onSubmit: async (values) => {
      onConfirm(Number(values.endCash));
      formik.resetForm();
      onClose();
    },
  });

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold text-gray-800 mb-4">End Shift</h2>
        <p className="text-gray-600 mb-4">Enter the final cash amount (Rp):</p>

        {/* Form */}
        <form onSubmit={formik.handleSubmit}>
          {/* End Cash Input */}
          <div className="mb-4">
            <label className="block text-gray-800 font-medium">
              Ending Cash (Rp)
            </label>
            <input
              type="text"
              name="endCash"
              className={`w-full p-2 border rounded text-gray-800 ${
                formik.touched.endCash && formik.errors.endCash
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="Rp 100,000"
              value={formik.values.endCash}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.endCash && formik.errors.endCash && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.endCash}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              End Shift
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
