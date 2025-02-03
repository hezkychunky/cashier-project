import React from 'react';

interface ShiftSummaryProps {
  cashTransactions: number;
  debitTransactions: number;
}

const ShiftSummary: React.FC<ShiftSummaryProps> = ({
  cashTransactions,
  debitTransactions,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 mb-8 bg-orange-500 shadow-lg rounded-2xl w-3/4 mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Shift Summary
      </h2>

      <div className="grid grid-cols-2 gap-6 w-full">
        <div className="flex flex-col items-center justify-center bg-blue-100 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Cash Transactions</p>
          <p className="text-2xl font-bold text-blue-600">
            Rp {cashTransactions.toLocaleString()}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center bg-green-100 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Debit Transactions</p>
          <p className="text-2xl font-bold text-green-600">
            Rp {debitTransactions.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShiftSummary;
