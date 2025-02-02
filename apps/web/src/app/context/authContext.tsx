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

interface Shift {
  id: number;
  userId: number;
  shiftType: 'OPENING' | 'CLOSING';
  startTime: string;
  startCash: number;
  isActive: boolean;
}

// Define auth context type
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

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [shift, setShift] = useState<Shift | null>(null);

  // ✅ Restore user from cookies when page reloads
  const refreshAuth = useCallback(() => {
    const token = Cookies.get('token');
    const userData = Cookies.get('user')
      ? JSON.parse(Cookies.get('user')!)
      : null;
    const activeShift = Cookies.get('activeShift')
      ? JSON.parse(Cookies.get('activeShift')!)
      : null;

    if (token && userData) {
      setUser(userData); // ✅ Restore user from cookies
    } else {
      setUser(null);
    }

    if (activeShift) {
      setShift(activeShift); // ✅ Restore shift from cookies
    } else {
      setShift(null);
    }
  }, []);

  // ✅ Fetch active shift after login or page refresh
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
      setShift(null); // Ensure shift state resets when no active shift exists
    }
  }, [user]);

  // ✅ Start a new shift
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
        setShift(data.shift); // ✅ Update shift state immediately

        // ✅ Store shift data in cookies for persistence
        Cookies.set('activeShift', JSON.stringify(data.shift), { expires: 1 });
      } catch (error) {
        console.error('Error starting shift:', error);
      }
    },
    [user],
  );

  // ✅ End an active shift
  const endShift = useCallback(
    async (endCash: number) => {
      if (!shift) return;

      try {
        const response = await fetch(`${BASEURL}/api/shift/${shift.id}/end`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endCash }), // ✅ Send `endCash` in request
        });

        if (response.ok) {
          setShift(null); // ✅ Clear shift state
          Cookies.remove('activeShift'); // ✅ Remove shift from cookies
          console.log('Shift ended successfully');
        }
      } catch (error) {
        console.error('Error ending shift:', error);
      }
    },
    [shift],
  );

  // ✅ Handle login & store user data in cookies
  const login = useCallback(
    (token: string, user: User) => {
      Cookies.set('token', token, { expires: 1 });
      Cookies.set('userRole', user.role, { expires: 1 });
      Cookies.set('user', JSON.stringify(user), { expires: 1 });

      setUser(user);
      fetchActiveShift(); // ✅ Fetch shift data after login
      router.push(user.role === 'CASHIER' ? '/cashier' : '/sales-admin');
    },
    [fetchActiveShift, router],
  );

  // ✅ Handle logout & clear user data
  const logout = useCallback(() => {
    Cookies.remove('token');
    Cookies.remove('userRole');
    Cookies.remove('user');

    setUser(null);
    setShift(null);
    router.push('/login');
  }, [router]);

  // ✅ Restore user & fetch active shift on page reload
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

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
