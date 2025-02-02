'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';

interface StartShiftModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (amount: number, shiftType: 'OPENING' | 'CLOSING') => void;
}

export const StartShiftModal: React.FC<StartShiftModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
}) => {
  // Formik setup for validation
  const formik = useFormik({
    initialValues: {
      amount: '',
      shiftType: 'OPENING',
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .typeError('Please enter a valid number')
        .min(10000, 'Minimum amount is Rp 10,000')
        .required('Amount is required'),
      shiftType: Yup.string()
        .oneOf(['OPENING', 'CLOSING'])
        .required('Shift type is required'),
    }),
    onSubmit: async (values) => {
      onConfirm(
        Number(values.amount),
        values.shiftType as 'OPENING' | 'CLOSING',
      );
      formik.resetForm();
      onClose();
    },
  });

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Start Shift</h2>
        <p className="text-gray-600 mb-4">
          Enter the starting cash amount (Rp) and select shift type:
        </p>

        {/* Form */}
        <form onSubmit={formik.handleSubmit}>
          {/* Amount Input */}
          <div className="mb-4">
            <label className="block text-gray-800 font-medium">
              Starting Cash (Rp)
            </label>
            <input
              type="text"
              name="amount"
              className={`w-full p-2 border rounded text-gray-800 ${
                formik.touched.amount && formik.errors.amount
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="Rp 100,000"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.amount && formik.errors.amount && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.amount}
              </p>
            )}
          </div>

          {/* Shift Type Select */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Shift</label>
            <select
              name="shiftType"
              className={`w-full p-2 border rounded text-gray-800 ${
                formik.touched.shiftType && formik.errors.shiftType
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              value={formik.values.shiftType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="OPENING">Opening</option>
              <option value="CLOSING">Closing</option>
            </select>
            {formik.touched.shiftType && formik.errors.shiftType && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.shiftType}
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
              Start Shift
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
