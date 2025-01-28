interface ShiftSales {
  shiftId: number;
  shiftType: string;
  fullName: string;
  transactionCount: number;
  cashTotal: number;
  debitTotal: number;
  startCash: number;
  endCash: number;
}

interface ShiftSalesTableProps {
  shiftSales: ShiftSales[];
}

export const ShiftSalesTable = ({ shiftSales }: ShiftSalesTableProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 border-2 border-orange-500 shadow-lg rounded-2xl w-3/4 mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Daily Sales (By Shift)
      </h2>
      <table className="w-full border-slate-700">
        <thead className="bg-orange-300 border-b">
          <tr>
            <th className="py-3 px-1 border-slate-700">Shift</th>
            <th className="py-3 px-1 border-slate-700">Name</th>
            <th className="py-3 px-1 border-slate-700">Transactions</th>
            <th className="py-3 px-1 border-slate-700">Cash Payment</th>
            <th className="py-3 px-1 border-slate-700">Debit Payment</th>
            <th className="py-3 px-1 border-slate-700">Start Cash</th>
            <th className="py-3 px-1 border-slate-700">End Cash</th>
          </tr>
        </thead>
        <tbody>
          {shiftSales.map((shift) => (
            <tr key={shift.shiftId} className="text-center">
              <td className="py-2 px-1">{shift.shiftType}</td>
              <td className="py-2 px-1">{shift.fullName}</td>
              <td className="py-2 px-1">{shift.transactionCount}</td>
              <td className="py-2 px-1">{shift.cashTotal.toLocaleString()}</td>
              <td className="py-2 px-1">{shift.debitTotal.toLocaleString()}</td>
              <td className="py-2 px-1">{shift.startCash.toLocaleString()}</td>
              <td
                className={
                  shift.endCash === shift.cashTotal + shift.startCash
                    ? 'py-2 px-1'
                    : 'py-2 px-1 text-red-500 font-extrabold animate-pulse'
                }
              >
                {shift.endCash?.toLocaleString() || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
