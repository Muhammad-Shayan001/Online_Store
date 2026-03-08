
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 animate-fade-in text-center">
      <h1 className="text-5xl font-serif text-slate-900 mb-8">Our Heritage</h1>
      <p className="text-xl text-slate-600 mb-12 leading-relaxed">
        Founded in 2024, Online Store was born from a simple obsession: finding the perfect balance between uncompromising quality and contemporary aesthetics. We believe that the products you use every day should be as beautiful as they are functional.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left mt-20">
        <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
          <p className="text-slate-600">To provide discerning customers with a curated selection of essentials that elevate daily life, backed by a commitment to ethical sourcing and exceptional design.</p>
        </div>
        <div className="p-8 bg-indigo-600 text-white rounded-3xl shadow-xl">
          <h3 className="text-2xl font-bold mb-4 text-white">Quality Promise</h3>
          <p className="text-indigo-100">Every item in our store undergoes rigorous inspection. We only partner with artisans and manufacturers who share our vision for longevity and detail.</p>
        </div>
      </div>
      <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200" className="w-full h-96 object-cover rounded-3xl mt-20 shadow-2xl" alt="Our Workspace" />
    </div>
  );
};

export default About;
