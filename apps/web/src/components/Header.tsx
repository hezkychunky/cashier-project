'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useAuth } from '@/app/context/authContext';
import { StartShiftModal } from '@/components/StartShiftModal';
import { EndShiftModal } from '@/components/EndShiftModal';

export const Header = () => {
  const { user, logout, shift, startShift, endShift } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isStartModalVisible, setIsStartModalVisible] = useState(false);
  const [isEndModalVisible, setIsEndModalVisible] = useState(false);

  useEffect(() => {
    setUserRole(Cookies.get('userRole') || null);
  }, [user, shift]);

  return (
    <header className="bg-orange-500 text-white p-4 flex justify-even items-center sticky top-0 z-30">
      <h1 className="text-xl font-semibold">
        Hi,{' '}
        <span className="text-xl font-semibold text-gray-800">
          {user?.fullName}
        </span>
      </h1>
      <div className="flex-1 text-center font-bold text-3xl">
        BETTER<span className="text-gray-800"> CASHIER</span>
      </div>
      <div className="flex gap-2">
        {userRole === 'CASHIER' &&
          (shift ? (
            <button
              onClick={() => setIsEndModalVisible(true)}
              className="bg-gray-800 text-orange-500 px-2 w-24 py-2 rounded font-medium hover:bg-gray-700"
            >
              End Shift
            </button>
          ) : (
            <button
              onClick={() => setIsStartModalVisible(true)}
              className="bg-white text-orange-500 px-2 w-24 py-2 rounded font-medium hover:bg-orange-100"
            >
              Start Shift
            </button>
          ))}

        {user && (
          <button
            onClick={logout}
            className="bg-white text-orange-500 px-2 w-24 py-2 rounded font-medium hover:bg-orange-100"
          >
            Logout
          </button>
        )}
      </div>

      <StartShiftModal
        isVisible={isStartModalVisible}
        onClose={() => setIsStartModalVisible(false)}
        onConfirm={startShift}
      />

      <EndShiftModal
        isVisible={isEndModalVisible}
        onClose={() => setIsEndModalVisible(false)}
        onConfirm={(endCash) => {
          endShift(endCash);
          setIsEndModalVisible(false);
        }}
      />
    </header>
  );
};
