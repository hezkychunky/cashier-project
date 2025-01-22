import { useState } from 'react';

export const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash'); // Default to 'cash'
  const [cardNumber, setCardNumber] = useState('');
  const [cashReceived, setCashReceived] = useState('');

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center border-b pb-2">
          <span>Product 1</span>
          <span>$10</span>
        </div>
        <div className="flex justify-between items-center border-b pb-2">
          <span>Product 2</span>
          <span>$15</span>
        </div>
        <div className="flex justify-between items-center">
          <strong>Total:</strong>
          <strong>$25</strong>
        </div>
      </div>
      {/* Payment Method Selection */}
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Payment Method</h3>
        <div className="flex gap-4">
          {/* Cash Button */}
          <button
            className={`py-2 px-4 rounded-lg ${
              paymentMethod === 'cash'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700'
            } hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300`}
            onClick={() => setPaymentMethod('cash')}
          >
            Cash
          </button>
          {/* Card Button */}
          <button
            className={`py-2 px-4 rounded-lg ${
              paymentMethod === 'card'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700'
            } hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300`}
            onClick={() => setPaymentMethod('card')}
          >
            Card
          </button>
        </div>
        {/* Card Number Input */}
        {paymentMethod === 'card' && (
          <div className="mt-4">
            <label
              htmlFor="card-number"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Card Number
            </label>
            <input
              id="card-number"
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="Enter your card number"
            />
          </div>
        )}
        {/* Cash Received Input */}
        {paymentMethod === 'cash' && (
          <div className="mt-4">
            <label
              htmlFor="cash-received"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Amount Received
            </label>
            <input
              id="cash-received"
              type="number"
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="Enter amount received"
            />
          </div>
        )}
      </div>
    </>
  );
};
