import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Plus, Tag } from 'lucide-react';
import AdminLayout from './AdminLayout';

interface Coupon {
  _id: string;
  code: string;
  discount: number;
  expirationDate?: string;
  isActive: boolean;
}

const AdminCouponList: React.FC<{ user: any }> = ({ user }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [expirationDate, setExpirationDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data } = await axios.get('/api/coupons', { withCredentials: true });
      setCoupons(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await axios.post(
        '/api/coupons',
        { code, discount, expirationDate },
        { withCredentials: true }
      );
      setCode('');
      setDiscount(0);
      setExpirationDate('');
      fetchCoupons();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error creating coupon');
    } finally {
      setCreateLoading(false);
    }
  };

  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`/api/coupons/${id}`, { withCredentials: true });
        fetchCoupons();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <AdminLayout user={user}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Coupons</h1>
          <p className="text-sm text-slate-500 mt-0.5">{coupons.length} active coupons</p>
        </div>
      </div>

      {/* Create Form */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 mb-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Create New Coupon</h3>
        <form onSubmit={createHandler} className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Code</label>
            <input
              type="text"
              placeholder="e.g. SUMMER20"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 uppercase transition-colors"
              required
            />
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Discount (%)</label>
            <input
              type="number"
              placeholder="0-100"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors"
              min="1"
              max="100"
              required
            />
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Expiration (Optional)</label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={createLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center text-sm font-semibold transition-colors shadow-sm disabled:opacity-50"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Create
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Code</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Discount</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Expires</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <div className="w-7 h-7 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <Tag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">No coupons found</p>
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="text-[13px] font-bold text-slate-800 font-mono bg-slate-100 px-2 py-0.5 rounded">{coupon.code}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[13px] font-bold text-indigo-600">{coupon.discount}%</span>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-slate-500">
                    {coupon.expirationDate ? new Date(coupon.expirationDate).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      coupon.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                    }`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => deleteHandler(coupon._id)}
                      className="text-slate-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors inline-flex"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminCouponList;
