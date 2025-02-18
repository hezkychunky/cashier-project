interface ProductSales {
  productId: number;
  productName: string;
  category: string;
  soldQuantity: number;
}

interface ProductSalesTableProps {
  productSales: ProductSales[];
}

export const ProductSalesTable = ({ productSales }: ProductSalesTableProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 border-4 border-orange-500 shadow-lg rounded-2xl w-3/4 mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Sales By Product
      </h2>
      <table className="w-full border-slate-700">
        <thead className="bg-orange-300 border-b">
          <tr>
            <th className="py-3 px-1 border-slate-700">No</th>
            <th className="py-3 px-1 border-slate-700">Product Name</th>
            <th className="py-3 px-1 border-slate-700">Category</th>
            <th className="py-3 px-1 border-slate-700">Sold Amount</th>
          </tr>
        </thead>
        <tbody>
          {productSales.map((product, index) => (
            <tr key={product.productId} className="text-center">
              <td className="py-2 px-1">{index + 1}</td>
              <td className="py-2 px-1">{product.productName}</td>
              <td className="py-2 px-1">{product.category}</td>
              <td className="py-2 px-1">{product.soldQuantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
