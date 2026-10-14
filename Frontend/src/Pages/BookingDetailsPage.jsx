import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import bookingService from '../services/bookingService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { formatCurrency, formatDate } from '../utils/formatters';
import { FiArrowLeft, FiPrinter, FiCalendar, FiUsers, FiClock, FiCreditCard, FiCheckCircle } from 'react-icons/fi';

export const BookingDetailsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const bookingType = searchParams.get('type') || 'tour';

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        setError(false);

        let data = null;
        if (bookingType === 'tour') {
          data = await bookingService.getTourBookingById(id);
        } else {
          data = await bookingService.getHotelBookingById(id);
        }
        setBooking(data);
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id, bookingType]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <LoadingSpinner text="Loading booking confirmation..." />;
  if (error || !booking) return <ErrorState message="Could not find requested booking details." />;

  const isTour = Boolean(booking.tour);
  const title = isTour ? booking.tour?.name : booking.hotel?.name;
  const image = isTour ? booking.tour?.images?.[0] : booking.hotel?.images?.[0];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto space-y-8 print:p-0">
        {/* Navigation & Print Bar */}
        <div className="flex items-center justify-between print:hidden">
          <Link
            to="/my-bookings"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 uppercase tracking-wider"
          >
            <FiArrowLeft className="w-4 h-4" /> Back to My Bookings
          </Link>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-slate-800 transition cursor-pointer"
          >
            <FiPrinter className="w-4 h-4" /> Print Confirmation
          </button>
        </div>

        {/* Invoice / Voucher Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-xl space-y-8 text-left">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white font-bold flex items-center justify-center text-base">
                  W
                </div>
                <span className="text-xl font-black text-slate-900">WAYFARE</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Official Booking & Payment Confirmation Pass</p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200 capitalize">
                Status: {booking.status}
              </span>
              <p className="text-xs font-mono font-bold text-slate-700">
                REF: {booking.bookingReference}
              </p>
              {booking.transactionId && (
                <p className="text-[11px] font-mono text-cyan-600 font-semibold">
                  TXN: {booking.transactionId}
                </p>
              )}
            </div>
          </div>

          {/* Item Preview */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {image && (
              <img src={image} alt={title} className="w-20 h-20 rounded-xl object-cover" />
            )}
            <div>
              <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">
                {isTour ? 'Tour Package' : 'Hotel Accommodation'}
              </span>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              {!isTour && booking.room && (
                <p className="text-xs text-slate-500 font-medium">Room: {booking.room.roomType} Suite</p>
              )}
            </div>
          </div>

          {/* Booking Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Schedule & Guests</h4>
              <p className="text-slate-600 flex items-center gap-2">
                <FiCalendar className="text-cyan-600 w-4 h-4" />
                {isTour ? formatDate(booking.tourDate) : `${formatDate(booking.checkIn)} to ${formatDate(booking.checkOut)}`}
              </p>
              <p className="text-slate-600 flex items-center gap-2">
                <FiUsers className="text-cyan-600 w-4 h-4" />
                {booking.numberOfGuests} Guest(s)
              </p>
              {!isTour && (
                <p className="text-slate-600 flex items-center gap-2">
                  <FiClock className="text-cyan-600 w-4 h-4" />
                  {booking.numberOfNights} Night(s), {booking.numberOfRooms || 1} Room(s)
                </p>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Customer Details</h4>
              <p className="text-slate-700 font-semibold">
                {booking.user?.firstName} {booking.user?.lastName}
              </p>
              <p className="text-slate-500">{booking.user?.email}</p>
              <p className="text-slate-500">{booking.user?.phone || 'Phone not provided'}</p>
            </div>
          </div>

          {/* Price & Payment Breakdown */}
          <div className="border-t border-slate-100 pt-6 space-y-3 text-sm">
            <h4 className="font-bold text-slate-900">Payment Breakdown</h4>
            <div className="bg-slate-50 p-5 rounded-2xl space-y-3">
              <div className="flex justify-between text-slate-600">
                <span>Payment Method</span>
                <span className="font-bold text-slate-800 capitalize flex items-center gap-1.5">
                  <FiCreditCard className="text-cyan-600" />
                  {booking.paymentMethod || 'Credit/Debit Card'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Status</span>
                <span className="font-bold text-emerald-600 capitalize flex items-center gap-1">
                  <FiCheckCircle />
                  {booking.paymentStatus || 'Paid'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Taxes & Service Fees</span>
                <span>Included</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between font-black text-slate-900 text-lg">
                <span>Total Amount Paid</span>
                <span className="text-cyan-600">{formatCurrency(booking.totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-slate-100 text-xs text-slate-400">
            Thank you for booking with Wayfare Travel. Present this confirmation voucher upon arrival.
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage;
