export const DetailedTransactions: React.FC<DetailedTransactionsProps> = ({
  orders,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 border-2 border-orange-500 shadow-lg rounded-2xl w-5/6 mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Transaction Detail
      </h2>
      <table className="w-full border-slate-700">
        <thead className="bg-orange-300 border-b">
          <tr>
            <th className="py-3 px-1 border-slate-700">No</th>
            <th className="py-3 px-1 border-slate-700">Order ID</th>
            <th className="py-3 px-1 border-slate-700">Item</th>
            <th className="py-3 px-1 border-slate-700">Price</th>
            <th className="py-3 px-1 border-slate-700">Qty</th>
            <th className="py-3 px-1 border-slate-700">Total</th>
            <th className="py-3 px-1 border-slate-700">Time</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-4 text-red-500">
                No transactions found for this date.
              </td>
            </tr>
          ) : (
            orders.map((order, index) =>
              order.items.map((item, itemIndex) => (
                <tr key={`${order.id}-${itemIndex}`} className="border-t">
                  {itemIndex === 0 ? (
                    <>
                      <td
                        rowSpan={order.items.length}
                        className="py-3 px-1 text-center"
                      >
                        {index + 1}
                      </td>
                      <td
                        rowSpan={order.items.length}
                        className="py-3 px-1 text-center"
                      >
                        {order.id}
                      </td>
                    </>
                  ) : null}
                  <td className="py-3 px-1 text-center">{item.name}</td>
                  <td className="py-3 px-1 text-center">
                    Rp {item.price.toLocaleString()}
                  </td>
                  <td className="py-3 px-1 text-center">{item.quantity}</td>
                  <td className="py-3 px-1 text-center">
                    Rp {(item.price * item.quantity).toLocaleString()}
                  </td>
                  {itemIndex === 0 ? (
                    <td
                      rowSpan={order.items.length}
                      className="py-3 px-1 text-center"
                    >
                      {new Date(order.createdAt).toLocaleTimeString('en-GB')}{' '}
                    </td>
                  ) : null}
                </tr>
              )),
            )
          )}
        </tbody>
      </table>
    </div>
  );
};
