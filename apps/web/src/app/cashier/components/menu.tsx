export const Menu = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {Array(20)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 text-center shadow hover:shadow-md hover:bg-gray-50 cursor-pointer"
          >
            <div className="h-20 bg-gray-200 mb-2" />
            <p className="font-medium">Product {index + 1}</p>
            <p className="text-gray-500">$10.00</p>
          </div>
        ))}
    </div>
  );
};
