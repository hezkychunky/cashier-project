'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

interface User {
  id: string;
  email: string;
  role: 'CASHIER' | 'ADMIN';
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  shift: Shift | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  fetchActiveShift: () => Promise<void>;
  startShift: (
    amount: number,
    shiftType: 'OPENING' | 'CLOSING',
  ) => Promise<void>;
  endShift: (endCash: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [shift, setShift] = useState<Shift | null>(null);

  const refreshAuth = useCallback(() => {
    const token = Cookies.get('token');
    const userData = Cookies.get('user')
      ? JSON.parse(Cookies.get('user')!)
      : null;
    const activeShift = Cookies.get('activeShift')
      ? JSON.parse(Cookies.get('activeShift')!)
      : null;

    if (token && userData) {
      setUser(userData);
    } else {
      setUser(null);
    }

    if (activeShift) {
      setShift(activeShift);
    } else {
      setShift(null);
    }
  }, []);

  const fetchActiveShift = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `${BASEURL}/api/shift/active?userId=${user.id}`,
      );
      if (!response.ok) throw new Error('No active shift found');

      const data = await response.json();
      setShift(data.shift);
    } catch (error) {
      console.error('Error fetching active shift:', error);
      setShift(null);
    }
  }, [user]);

  const startShift = useCallback(
    async (amount: number, shiftType: 'OPENING' | 'CLOSING') => {
      if (!user) return;

      try {
        const response = await fetch(`${BASEURL}/api/shift/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            shiftType,
            startCash: amount,
            isActive: true,
          }),
        });

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || 'Failed to start shift');

        console.log('Shift started:', data);
        setShift(data.shift);

        Cookies.set('activeShift', JSON.stringify(data.shift), { expires: 1 });
      } catch (error) {
        console.error('Error starting shift:', error);
      }
    },
    [user],
  );

  const endShift = useCallback(
    async (endCash: number) => {
      if (!shift) return;

      try {
        const response = await fetch(`${BASEURL}/api/shift/${shift.id}/end`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endCash }),
        });

        if (response.ok) {
          setShift(null);
          Cookies.remove('activeShift');
          console.log('Shift ended successfully');
        }
      } catch (error) {
        console.error('Error ending shift:', error);
      }
    },
    [shift],
  );

  const login = useCallback(
    (token: string, user: User) => {
      Cookies.set('token', token, { expires: 1 });
      Cookies.set('userRole', user.role, { expires: 1 });
      Cookies.set('user', JSON.stringify(user), { expires: 1 });

      setUser(user);
      fetchActiveShift();
      router.push(user.role === 'CASHIER' ? '/cashier' : '/sales-admin');
    },
    [fetchActiveShift, router],
  );

  const logout = useCallback(() => {
    Cookies.remove('token');
    Cookies.remove('userRole');
    Cookies.remove('user');

    setUser(null);
    setShift(null);
    router.push('/login');
  }, [router]);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  useEffect(() => {
    if (user) fetchActiveShift();
  }, [user, fetchActiveShift]);

  return (
    <AuthContext.Provider
      value={{
        user,
        shift,
        login,
        logout,
        fetchActiveShift,
        startShift,
        endShift,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
