'use client';

import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoCreateOutline, IoAddCircleOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import CreateUserModal from './components/createAccountModal';
import EditUserModal from './components/editAccountModal';
import DeleteUserModal from './components/deleteAccountModal';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function AccountManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(`${BASEURL}/api/user`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setUsers(data.data);
    };
    fetchUsers();
  }, []);

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
    <div className="flex flex-col items-center h-auto bg-[#fffaf0] text-gray-800 py-4 gap-4">
      <h1 className="font-bold">EMPLOYEE MANAGEMENT</h1>
      <div className="flex space-x-4">
        <button
          onClick={openCreateModal}
          className="flex bg-lime-500 items-center p-2 rounded-md h-10 hover:bg-lime-400"
        >
          Add Data
          <IoAddCircleOutline size={30} />
        </button>
        <select className="mb-4 border p-2 rounded bg-white">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="cashier">Cashier</option>
        </select>
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

      {/* Modals */}
      {isCreateModalOpen && <CreateUserModal onClose={closeModal} />}
      {isEditModalOpen && selectedUser && (
        <EditUserModal user={selectedUser} onClose={closeModal} />
      )}
      {isDeleteModalOpen && selectedUser && (
        <DeleteUserModal user={selectedUser} onClose={closeModal} />
      )}
    </div>
  );
}
