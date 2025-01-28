import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

type PaymentFormProps = {
  paymentMethod: 'CASH' | 'DEBIT';
  setPaymentMethod: React.Dispatch<React.SetStateAction<'CASH' | 'DEBIT'>>;
  totalPrice: number;
  onSubmit: (paymentDetails: any) => void;
};

export const PaymentForm = ({
  paymentMethod,
  setPaymentMethod,
  totalPrice,
  onSubmit,
}: PaymentFormProps) => {
  const formik = useFormik({
    initialValues: {
      cardNumber: '',
      cashReceived: '',
    },
    validationSchema: Yup.object({
      cardNumber:
        paymentMethod === 'DEBIT'
          ? Yup.string()
              .required('Required')
              .matches(/^\d+$/, 'Card number must contain only digits')
              .min(16, 'Card number must be exactly 16 digits')
              .max(16, 'Card number must be exactly 16 digits')
          : Yup.string(),
      cashReceived:
        paymentMethod === 'CASH'
          ? Yup.number()
              .typeError('Must be a number')
              .min(totalPrice, `Must be at least Rp ${totalPrice}`)
              .required('Required')
          : Yup.number(),
    }),
    onSubmit: (values) => {
      const paymentDetails =
        paymentMethod === 'DEBIT'
          ? { cardNumber: values.cardNumber }
          : { cashReceived: parseFloat(values.cashReceived) };
      onSubmit(paymentDetails);
      formik.resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Payment Method</h3>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setPaymentMethod('CASH')}
            className={`py-2 px-4 rounded-lg ${
              paymentMethod === 'CASH'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700'
            } hover:bg-orange-600`}
          >
            Cash
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('DEBIT')}
            className={`py-2 px-4 rounded-lg ${
              paymentMethod === 'DEBIT'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700'
            } hover:bg-orange-600`}
          >
            Debit
          </button>
        </div>
      </div>
      {paymentMethod === 'DEBIT' && (
        <div className="mt-4">
          <label
            htmlFor="card-number"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Card Number
          </label>
          <input
            id="card-number"
            name="cardNumber"
            type="text"
            value={formik.values.cardNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg ${
              formik.touched.cardNumber && formik.errors.cardNumber
                ? 'border-red-500 focus:ring-red-300'
                : 'focus:ring-orange-300'
            }`}
            placeholder="Enter your card number"
          />
          {formik.touched.cardNumber && formik.errors.cardNumber && (
            <p className="text-red-500 text-sm">{formik.errors.cardNumber}</p>
          )}
        </div>
      )}
      {paymentMethod === 'CASH' && (
        <div className="mt-4">
          <label
            htmlFor="cash-received"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount Received
          </label>
          <input
            id="cash-received"
            name="cashReceived"
            type="number"
            value={formik.values.cashReceived}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg ${
              formik.touched.cashReceived && formik.errors.cashReceived
                ? 'border-red-500 focus:ring-red-300'
                : 'focus:ring-orange-300'
            }`}
            placeholder="Enter amount received"
          />
          {formik.touched.cashReceived && formik.errors.cashReceived && (
            <p className="text-red-500 text-sm">{formik.errors.cashReceived}</p>
          )}
        </div>
      )}
      <div className="mt-6">
        <button
          type="submit"
          className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600"
        >
          Submit Order
        </button>
      </div>
    </form>
  );
};
