import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Shield, Trash2, Users } from 'lucide-react';
import AdminLayout from './AdminLayout';

interface UserData {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isVerified: boolean;
  createdAt: string;
}

const AdminUserList: React.FC<{ user: any }> = ({ user }) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/users', { withCredentials: true });
      setUsers(data);
    } catch (err: any) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/users/${id}`, { withCredentials: true });
        fetchUsers();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const promoteHandler = async (id: string, isAdmin: boolean) => {
     try {
        await axios.put(`/api/users/${id}`, { isAdmin: !isAdmin }, { withCredentials: true });
        fetchUsers();
     } catch (err: any) {
        alert(err.response?.data?.message);
     }
  }

  return (
    <AdminLayout user={user}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-sm text-slate-500 mt-0.5">{users.length} registered users</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-7 h-7 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-red-600 bg-red-50 p-4 rounded-xl border border-red-200 text-sm">{error}</div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-slate-800">{u.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{u._id.slice(-8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <a href={`mailto:${u.email}`} className="text-[13px] text-slate-500 hover:text-indigo-600 transition-colors">
                      {u.email}
                    </a>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    {u.isAdmin ? (
                      <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600">
                        <Shield className="w-3 h-3 mr-1" /> Admin
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => promoteHandler(u._id, u.isAdmin)}
                      className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg mr-1 transition-colors ${
                        u.isAdmin
                          ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                          : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
                      }`}
                    >
                      {u.isAdmin ? 'Demote' : 'Promote'}
                    </button>
                    {!u.isAdmin && (
                      <button
                        onClick={() => deleteHandler(u._id)}
                        className="text-slate-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors inline-flex"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="p-12 text-center">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No users found</p>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUserList;
