'use client';

import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoCreateOutline, IoAddCircleOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CreateUserModal from './components/createAccountModal';
import EditUserModal from './components/editAccountModal';
import DeleteUserModal from './components/deleteAccountModal';
import debounce from 'lodash.debounce';
import ResetFiltersButton from '@/components/ResetFiltersButton';
import { fetchWithAuth } from '@/app/utils/fetchWithAuth';
import PaginationControls from '@/components/PaginationControls';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function AccountManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const roleParam = searchParams.get('role') || '';
  const searchParam = searchParams.get('search') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [selectedRole, setSelectedRole] = useState<string>(roleParam);
  const [searchQuery, setSearchQuery] = useState<string>(searchParam);
  const [debouncedSearch, setDebouncedSearch] = useState<string>(searchParam);

  const fetchUsers = async (role: string, search: string, page: number) => {
    try {
      let queryParams = new URLSearchParams();
      if (role) queryParams.append('role', role);
      if (search) queryParams.append('search', search);
      queryParams.append('page', page.toString());

      const data = await fetchWithAuth(
        `${BASEURL}/api/user?${queryParams.toString()}`,
      );

      if (!data || !data.success) {
        throw new Error('Failed to fetch users');
      }

      setUsers(data.data);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const updateFilters = (role: string, search: string, page: number = 1) => {
    const params = new URLSearchParams();
    if (role) params.set('role', role);
    if (search) params.set('search', search);
    params.set('page', page.toString());

    router.push(`?${params.toString()}`);
    fetchUsers(role, search, page);
  };

  useEffect(() => {
    fetchUsers(
      searchParams.get('role') || '',
      searchParams.get('search') || '',
      pageParam,
    );
  }, [pageParam, searchParams]);

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    handler();

    return () => handler.cancel();
  }, [searchQuery]);

  useEffect(() => {
    updateFilters(selectedRole, debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedRole]);

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const role = event.target.value;
    setSelectedRole(role);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const refreshUsers = () => {
    fetchUsers(selectedRole, debouncedSearch, pageParam);
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };
  const closeModal = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="flex flex-col items-center h-auto bg-white text-gray-800 ml-20 py-4 gap-4">
      <h1 className="font-bold">EMPLOYEE MANAGEMENT</h1>

      <div className="flex space-x-4">
        <button
          onClick={openCreateModal}
          className="flex bg-lime-500 items-center p-2 rounded-md h-10 hover:bg-lime-400"
        >
          Add Data
          <IoAddCircleOutline size={30} />
        </button>

        <select
          value={selectedRole}
          onChange={handleRoleChange}
          className="border p-2 rounded-lg bg-white"
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="CASHIER">Cashier</option>
        </select>

        <input
          type="text"
          placeholder="Search by Full Name..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="border p-2 rounded-lg bg-white border-orange-500"
        />
        <ResetFiltersButton />
      </div>

      <table className="w-4/5 border-slate-700">
        <thead className="bg-orange-300 border-b">
          <tr>
            <th className="py-3 px-1 border-slate-700">ID</th>
            <th className="py-3 px-1 border-slate-700">Full Name</th>
            <th className="py-3 px-1 border-slate-700">Email</th>
            <th className="py-3 px-1 border-slate-700">Role</th>
            <th className="py-3 px-1 border-slate-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center border-b">
              <td className="py-3 px-1 border-slate-700">{user.id}</td>
              <td className="py-3 px-1 border-slate-700">{user.fullName}</td>
              <td className="py-3 px-1 border-slate-700">{user.email}</td>
              <td className="py-3 px-1 border-slate-700">{user.role}</td>
              <td>
                <div className="flex gap-1 justify-center">
                  <button
                    onClick={() => openEditModal(user)}
                    className="rounded-md border border-orange-500 p-2 hover:bg-orange-200"
                  >
                    <IoCreateOutline />
                  </button>
                  <button
                    onClick={() => openDeleteModal(user)}
                    className="rounded-md border border-orange-500 p-2 hover:bg-orange-200"
                  >
                    <RiDeleteBin6Line />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <PaginationControls totalPages={totalPages} currentPage={currentPage} />
      {/* Modals */}
      {isCreateModalOpen && (
        <CreateUserModal onClose={closeModal} refreshUsers={refreshUsers} />
      )}
      {isEditModalOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={closeModal}
          refreshUsers={refreshUsers}
        />
      )}
      {isDeleteModalOpen && selectedUser && (
        <DeleteUserModal
          user={selectedUser}
          onClose={closeModal}
          refreshUsers={refreshUsers}
        />
      )}
    </div>
  );
}
