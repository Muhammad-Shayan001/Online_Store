import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full"
    />
  </div>
);

export const ProductSkeleton = () => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-4 animate-pulse">
    <div className="w-full h-64 bg-slate-200 rounded-lg"></div>
    <div className="w-1/3 h-3 bg-slate-200 rounded mt-2"></div>
    <div className="w-3/4 h-5 bg-slate-200 rounded mt-1"></div>
    <div className="w-full h-4 bg-slate-200 rounded mt-2"></div>
    <div className="flex justify-between items-center mt-4">
      <div className="w-1/4 h-6 bg-slate-200 rounded"></div>
      <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
    </div>
  </div>
);

export const ProductGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <ProductSkeleton key={i} />)}
  </div>
);
