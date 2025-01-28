import React from 'react';

interface TransactionSummaryProps {
  totalTransactions: number;
  totalAmount: number;
}

const TransactionSummary: React.FC<TransactionSummaryProps> = ({
  totalTransactions,
  totalAmount,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-orange-500 shadow-lg rounded-2xl w-3/4 mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Daily Transaction Summary
      </h2>

      <div className="grid grid-cols-2 gap-6 w-full">
        <div className="flex flex-col items-center justify-center bg-blue-100 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <p className="text-2xl font-bold text-blue-600">
            {totalTransactions}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center bg-green-100 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-2xl font-bold text-green-600">
            Rp {totalAmount.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionSummary;
