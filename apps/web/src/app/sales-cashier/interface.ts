interface ShiftSummary {
  cashTransactions: number;
  debitTransactions: number;
}

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  createdAt: string;
  items: OrderItem[];
}

interface DetailedTransactionsProps {
  orders: Order[];
}
