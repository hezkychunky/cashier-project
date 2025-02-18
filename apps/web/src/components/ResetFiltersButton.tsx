'use client';

import { useRouter } from 'next/navigation';
import { IoRefreshOutline } from 'react-icons/io5';

export default function ResetFiltersButton() {
  const router = useRouter();

  const handleResetFilters = () => {
    router.push('?');
    router.refresh();
  };

  return (
    <button
      onClick={handleResetFilters}
      className="flex items-center p-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-all"
    >
      <IoRefreshOutline className="mx-1" size={30} />
    </button>
  );
}
