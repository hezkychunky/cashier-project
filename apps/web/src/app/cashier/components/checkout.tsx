import React, { useState } from 'react';
import { CartList } from './cartlist';
import { PaymentForm } from './paymentForm';
import { ConfirmationModal } from './confirmationModal';
import { SuccessModal } from './successModal';

type CheckoutProps = {
  cart: CartItem[];
  onRemoveFromCart: (name: string) => void;
  onSubmit: (paymentMethod: 'CASH' | 'DEBIT', paymentDetails: any) => void;
};

export const Checkout = ({
  cart,
  onRemoveFromCart,
  onSubmit,
}: CheckoutProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'DEBIT'>('CASH');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [changeAmount, setChangeAmount] = useState<number | undefined>(
    undefined,
  );

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      onRemoveFromCart(itemToDelete);
    }
    setIsModalOpen(false);
  };

  const handlePaymentSubmit = (paymentDetails: any) => {
    onSubmit(paymentMethod, paymentDetails);
    if (paymentMethod === 'CASH') {
      const change = paymentDetails.cashReceived - totalPrice;
      setChangeAmount(change);
    }
    setIsSuccessModalOpen(true);
  };

  return (
    <div>
      <CartList
        cart={cart}
        totalPrice={totalPrice}
        onRemoveFromCart={(name) => {
          setItemToDelete(name);
          setIsModalOpen(true);
        }}
      />
      {cart.length > 0 && (
        <PaymentForm
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          totalPrice={totalPrice}
          onSubmit={handlePaymentSubmit}
        />
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        itemName={itemToDelete}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        paymentMethod={paymentMethod}
        changeAmount={changeAmount}
      />
    </div>
  );
};
