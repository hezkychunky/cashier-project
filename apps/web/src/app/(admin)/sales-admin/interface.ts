interface TransactionData {
  totalTransactions: number;
  totalAmount: number;
}

interface ProductSales {
  productId: number;
  productName: string;
  category: string;
  soldQuantity: number;
}

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
