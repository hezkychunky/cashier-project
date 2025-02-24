import { fetchWithAuth } from '@/app/utils/fetchWithAuth';
import { toast } from 'react-toastify';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function DeleteUserModal({
  user,
  onClose,
  refreshUsers,
}: {
  user: User;
  onClose: () => void;
  refreshUsers: () => void;
}) {
  const handleDelete = async () => {
    try {
      const data = await fetchWithAuth(
        `${BASEURL}/api/user/delete/${user.id}`,
        {
          method: 'PATCH',
        },
      );

      if (!data || !data.success) {
        throw new Error('Failed to delete user');
      }

      toast.success(`${user.fullName} deleted successfully!`);
      refreshUsers();
      onClose();
    } catch (error) {
      toast.error(`Error deleting ${user.fullName}`);
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">Delete User</h2>
        <p>Are you sure you want to delete {user.fullName}?</p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
