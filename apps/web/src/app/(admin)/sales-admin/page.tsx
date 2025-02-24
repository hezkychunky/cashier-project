'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DatePickerComponent } from './components/datePicker';
import TransactionSummary from './components/transactionSummary';
import { ProductSalesTable } from './components/productSalesTable';
import { ShiftSalesTable } from './components/shiftSalesTable';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function SalesAdmin() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [transactionData, setTransactionData] = useState<TransactionData>({
    totalTransactions: 0,
    totalAmount: 0,
  });

  const dateParam = searchParams.get('date');
  const initialDate = dateParam ? new Date(dateParam) : new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  const [productSales, setProductSales] = useState<ProductSales[]>([]);
  const [shiftSales, setShiftSales] = useState<ShiftSales[]>([]);

  const fetchDailyTransactions = async (date: Date) => {
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const response = await fetch(
        `${BASEURL}/api/order/daily-transactions?date=${formattedDate}`,
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setTransactionData({
        totalTransactions: data.totalTransactions || 0,
        totalAmount: data.totalAmount || 0,
      });
    } catch (error) {
      console.error('Error fetching daily transactions:', error);
    }
  };

  const fetchDailyProductSales = async (date: Date) => {
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const response = await fetch(
        `${BASEURL}/api/order/daily-product-sales?date=${formattedDate}`,
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setProductSales(data);
    } catch (error) {
      console.error('Error fetching daily product sales:', error);
    }
  };

  const fetchDailyShiftSales = async (date: Date) => {
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const response = await fetch(
        `${BASEURL}/api/order/daily-shift-summary?date=${formattedDate}`,
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setShiftSales(data);
    } catch (error) {
      console.error('Error fetching daily shift sales:', error);
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    const formattedDate = date.toISOString().split('T')[0];
    router.push(`?date=${formattedDate}`);
  };

  useEffect(() => {
    fetchDailyTransactions(selectedDate);
    fetchDailyProductSales(selectedDate);
    fetchDailyShiftSales(selectedDate);
  }, [selectedDate]);

  return (
    <div className="flex flex-col items-center h-auto bg-white text-gray-800 ml-20 py-4 gap-4">
      <h1 className="font-bold">DAILY SALES & TRANSACTIONS REPORT</h1>
      <DatePickerComponent
        selectedDate={selectedDate}
        onChange={handleDateChange}
      />
      <TransactionSummary
        totalTransactions={transactionData.totalTransactions}
        totalAmount={transactionData.totalAmount}
      />
      <ProductSalesTable productSales={productSales} />
      <ShiftSalesTable shiftSales={shiftSales} />
    </div>
  );
}
