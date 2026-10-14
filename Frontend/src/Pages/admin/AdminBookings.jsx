import React, { useEffect, useState } from 'react';
import bookingService from '../../services/bookingService';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { FiSearch, FiFilter, FiCheck, FiX, FiBookmark } from 'react-icons/fi';

export const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAllAdminBookings({
        type: typeFilter,
        status: statusFilter,
        search,
      });
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching admin bookings:', error);
      toast.error('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [typeFilter, statusFilter, search]);

  const handleStatusChange = async (bookingId, bookingType, newStatus) => {
    try {
      await bookingService.updateAdminBookingStatus(bookingId, {
        status: newStatus,
        bookingType,
      });
      toast.success(`Booking status updated to ${newStatus}`);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update booking status.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Booking Management</h1>
          <p className="text-slate-500 text-sm">Monitor all tour and hotel bookings across the platform.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Reference code, customer, title..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full md:w-40 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
          >
            <option value="all">All Types</option>
            <option value="tour">Tour Bookings</option>
            <option value="hotel">Hotel Bookings</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-40 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner text="Fetching booking records..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-bold text-slate-700">
                <tr>
                  <th className="px-6 py-4">Ref Code</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Item / Title</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{b.bookingReference}</td>
                    <td className="px-6 py-4 uppercase text-xs font-bold text-cyan-600">{b.bookingType}</td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-bold text-slate-900 block">{b.user?.firstName} {b.user?.lastName}</span>
                        <span className="text-xs text-slate-400">{b.user?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{b.title}</td>
                    <td className="px-6 py-4">{formatDate(b.date)}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(b.totalAmount)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : b.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b._id, b.bookingType, e.target.value)}
                        className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
