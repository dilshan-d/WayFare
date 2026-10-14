import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUsers, FiClock, FiFileText, FiXCircle } from 'react-icons/fi';
import { formatCurrency, formatDate } from '../utils/formatters';

export const BookingCard = ({ booking, onCancel }) => {
  if (!booking) return null;

  const isTour = Boolean(booking.tour || booking.bookingReference?.startsWith('WF-TR'));
  const title = isTour ? booking.tour?.name || 'Tour Package' : booking.hotel?.name || 'Hotel Stay';
  const image = isTour
    ? booking.tour?.images?.[0] || 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80'
    : booking.hotel?.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

  const statusColors = {
    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    completed: 'bg-blue-50 text-blue-700 border-blue-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  const isCancellable = booking.status === 'confirmed' || booking.status === 'pending';

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row gap-5 items-center">
      {/* Thumbnail */}
      <div className="w-full sm:w-40 h-32 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      {/* Details */}
      <div className="flex-1 space-y-2 text-left w-full">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs font-mono font-bold text-slate-400">
            REF: {booking.bookingReference}
          </span>
          <span
            className={`px-3 py-0.5 rounded-full text-xs font-bold capitalize border ${
              statusColors[booking.status] || 'bg-slate-100 text-slate-700'
            }`}
          >
            {booking.status}
          </span>
        </div>

        <h4 className="text-lg font-bold text-slate-900">{title}</h4>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-1">
          <span className="flex items-center gap-1">
            <FiCalendar className="w-3.5 h-3.5 text-cyan-600" />
            {isTour ? formatDate(booking.tourDate) : `${formatDate(booking.checkIn)} - ${formatDate(booking.checkOut)}`}
          </span>

          <span className="flex items-center gap-1">
            <FiUsers className="w-3.5 h-3.5 text-cyan-600" />
            {booking.numberOfGuests} Guests
          </span>

          {!isTour && booking.numberOfNights && (
            <span className="flex items-center gap-1">
              <FiClock className="w-3.5 h-3.5 text-cyan-600" />
              {booking.numberOfNights} Nights
            </span>
          )}
        </div>
      </div>

      {/* Action / Price */}
      <div className="w-full sm:w-44 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-100 sm:pl-5 flex flex-col items-start sm:items-end justify-between self-stretch">
        <div className="text-left sm:text-right">
          <span className="text-xs text-slate-400 font-medium block">Total Paid</span>
          <span className="text-xl font-black text-slate-900">
            {formatCurrency(booking.totalAmount)}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3 w-full justify-end">
          {isCancellable && onCancel && (
            <button
              onClick={() => onCancel(booking)}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl transition flex items-center gap-1"
            >
              <FiXCircle className="w-3.5 h-3.5" /> Cancel
            </button>
          )}
          <Link
            to={`/bookings/${booking._id}?type=${isTour ? 'tour' : 'hotel'}`}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1"
          >
            <FiFileText className="w-3.5 h-3.5" /> Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
