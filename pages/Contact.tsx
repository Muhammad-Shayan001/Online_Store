
import React, { useState } from 'react';
import { STORE_EMAIL } from '../constants';
import { TicketService } from '../services/api';

const Contact: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject') || 'General Inquiry',
        message: formData.get('message')
    };

    try {
        await TicketService.createTicket(data);
        setStatus('success');
    } catch (error) {
        setStatus('error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h1 className="text-5xl font-serif text-slate-900 mb-6">Get in Touch</h1>
          <p className="text-lg text-slate-600 mb-12">Have a question about a product or your order? Our team is available 24/7 to provide assistance.</p>
          
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Email Us</h4>
                <p className="text-slate-500">{STORE_EMAIL}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Headquarters</h4>
                <p className="text-slate-500">7188 Innovation Way, San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 space-y-6">
            {status === 'success' ? (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl">
                    Thank you! Your ticket has been created. We will respond shortly.
                </div>
            ) : (
                <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input name="name" required type="text" className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-600" placeholder="John" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input name="email" required type="email" className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-600" placeholder="john@example.com" />
            </div>
          </div>
          <div>
             <label className="block text-sm font-semibold mb-1">Subject</label>
             <input name="subject" required type="text" className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-600" placeholder="Order Issue" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Message</label>
            <textarea name="message" required className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-600 h-32 resize-none" placeholder="How can we help?"></textarea>
          </div>
          <button disabled={status === 'loading'} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50">
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
          </>
            )}
        </form>
      </div>
    </div>
  );
};

export default Contact;
