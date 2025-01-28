import React from 'react';

type ConfirmationModalProps = {
  isOpen: boolean;
  itemName: string | null;
  onClose: () => void;
  onConfirm: () => void;
};

export const ConfirmationModal = ({
  isOpen,
  itemName,
  onClose,
  onConfirm,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to remove {itemName} from the cart?</p>
        <div className="flex justify-end mt-6 gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
