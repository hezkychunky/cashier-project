import React from 'react';

type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod: 'CASH' | 'DEBIT';
  changeAmount?: number; // Optional, only relevant for CASH payment
};

export const SuccessModal = ({
  isOpen,
  onClose,
  paymentMethod,
  changeAmount,
}: SuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg text-center">
        <h2 className="text-xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h2>
        <p className="text-gray-700 mb-4">
          Thank you for your purchase. Your payment was successful.
        </p>
        {paymentMethod === 'CASH' && changeAmount !== undefined && (
          <p className="text-lg font-medium text-gray-900">
            Change: Rp {changeAmount.toLocaleString()}
          </p>
        )}
        <button
          onClick={onClose}
          className="mt-6 py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};
