'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DatePickerComponent } from '../(admin)/sales-admin/components/datePicker';
import { DetailedTransactions } from './components/detailedTransactions';
import ShiftSummary from './components/shiftSummary';
import { useAuth } from '@/app/context/authContext';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function SalesCashier() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const dateParam = searchParams.get('date');
  const initialDate = dateParam ? new Date(dateParam) : new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  const [cashTransactions, setCashTransactions] = useState<number>(0);
  const [debitTransactions, setDebitTransactions] = useState<number>(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTransactionSummary = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `${BASEURL}/api/shift/summary?userId=${user.id}`,
      );
      if (!response.ok) throw new Error('Failed to fetch transaction summary');

      const data = await response.json();
      setCashTransactions(data.cashTransactions);
      setDebitTransactions(data.debitTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setCashTransactions(0);
      setDebitTransactions(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyOrders = async () => {
    if (!user) return;

    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const response = await fetch(
        `${BASEURL}/api/order/order-detail?date=${formattedDate}`,
      );
      if (!response.ok) throw new Error('Failed to fetch daily orders');

      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching daily orders:', error);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchTransactionSummary();
    fetchDailyOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, selectedDate]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    const formattedDate = date.toISOString().split('T')[0];
    router.push(`?date=${formattedDate}`);
  };

  return (
    <div className="flex flex-col items-center h-auto bg-white text-gray-800 py-10 gap-4 w-screen">
      {loading ? (
        <p className="text-gray-600">Loading transactions...</p>
      ) : (
        <ShiftSummary
          cashTransactions={cashTransactions}
          debitTransactions={debitTransactions}
        />
      )}
      <DatePickerComponent
        selectedDate={selectedDate}
        onChange={handleDateChange}
      />
      <DetailedTransactions orders={orders} />
    </div>
  );
}
