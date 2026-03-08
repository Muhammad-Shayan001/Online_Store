import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import AdminLayout from './AdminLayout';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  countInStock: number;
}

const AdminProductList: React.FC<{ user: any }> = ({ user }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products?pageSize=100');
      setProducts(data.products);
    } catch (err: any) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`, { withCredentials: true });
        fetchProducts();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm('Create a new sample product?')) {
        setCreateLoading(true);
      try {
        const { data } = await axios.post('/api/products', {}, { withCredentials: true });
        navigate(`/admin/product/${data._id}/edit`);
      } catch (err: any) {
        alert(err.response?.data?.message || 'Create failed');
      } finally {
        setCreateLoading(false);
      }
    }
  };

  return (
    <AdminLayout user={user}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500 mt-0.5">{products.length} total products</p>
        </div>
        <button
          onClick={createProductHandler}
          disabled={createLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg flex items-center text-sm font-semibold transition-colors shadow-sm disabled:opacity-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
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
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="text-[13px] font-semibold text-slate-800">{product.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{product._id.slice(-8)}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] font-semibold text-slate-800">${product.price}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">{product.category}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      product.countInStock === 0 ? 'bg-red-50 text-red-600' :
                      product.countInStock <= 5 ? 'bg-amber-50 text-amber-600' :
                      'bg-emerald-50 text-emerald-600'
                    }`}>
                      {product.countInStock === 0 ? 'Out of stock' : `${product.countInStock} in stock`}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                      className="text-slate-400 hover:text-indigo-600 p-1.5 hover:bg-indigo-50 rounded-lg transition-colors mr-1 inline-flex"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteHandler(product._id)}
                      className="text-slate-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors inline-flex"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="p-12 text-center">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No products found</p>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProductList;
