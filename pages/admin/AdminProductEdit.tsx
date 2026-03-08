import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import AdminLayout from './AdminLayout';

const AdminProductEdit: React.FC<{ user: any }> = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [coupon, setCoupon] = useState('');
  const [coupons, setCoupons] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setBrand(data.brand);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        setCoupon(data.coupon || '');

        const { data: couponsData } = await axios.get('/api/coupons', { withCredentials: true });
        setCoupons(couponsData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      await axios.put(
        `/api/products/${id}`,
        { name, price, coupon: coupon || null, image, brand, category, countInStock, description },
        { withCredentials: true }
      );
      navigate('/admin/products');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdateLoading(false);
    }
  };

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const { data } = await axios.post('/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setImage(data);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const inputClass = 'w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors';

  return (
    <AdminLayout user={user}>
      <Link to="/admin/products" className="text-slate-400 hover:text-slate-700 mb-6 inline-flex items-center text-sm font-medium transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Products
      </Link>

      <div className="max-w-3xl mx-auto bg-white rounded-xl border border-slate-200/80 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Edit Product</h1>
        <p className="text-sm text-slate-500 mb-8">Update product details and inventory</p>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-7 h-7 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-red-600 bg-red-50 p-4 rounded-xl border border-red-200 text-sm">{error}</div>
        ) : (
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Price</label>
                <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className={inputClass} required />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Brand</label>
                <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Stock</label>
                <input type="number" value={countInStock} onChange={(e) => setCountInStock(Number(e.target.value))} className={inputClass} required />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Coupon (Optional)</label>
                <select value={coupon} onChange={(e) => setCoupon(e.target.value)} className={inputClass}>
                  <option value="">No Coupon</option>
                  {coupons.map((c) => (
                    <option key={c._id} value={c._id}>{c.code} ({c.discount}% Off)</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Image</label>
              <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className={inputClass} required />
              <div className="flex items-center gap-3 mt-2">
                <label className="cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm border border-slate-200 inline-flex items-center transition-colors">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                  <input type="file" className="hidden" onChange={uploadFileHandler} />
                </label>
                {uploading && <span className="text-[12px] text-slate-400">Uploading...</span>}
                {image && <img src={image} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-slate-200" />}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className={inputClass + ' resize-none'}
                required
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={updateLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold inline-flex items-center shadow-sm transition-colors disabled:opacity-50"
              >
                {updateLoading ? 'Saving...' : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Product
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProductEdit;
