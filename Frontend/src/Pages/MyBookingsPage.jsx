import React, { useEffect, useState } from 'react';
import bookingService from '../services/bookingService';
import BookingCard from '../components/BookingCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import { FiBookmark } from 'react-icons/fi';

export const MyBookingsPage = () => {
  const [tourBookings, setTourBookings] = useState([]);
  const [hotelBookings, setHotelBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Cancel Modal state
  const [cancelTarget, setCancelTarget] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const [tours, hotels] = await Promise.all([
        bookingService.getMyTourBookings(),
        bookingService.getMyHotelBookings(),
      ]);

      setTourBookings(tours || []);
      setHotelBookings(hotels || []);
    } catch (error) {
      console.error('Error fetching my bookings:', error);
      toast.error('Failed to load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;

    const isTour = Boolean(cancelTarget.tour || cancelTarget.bookingReference?.startsWith('WF-TR'));

    try {
      if (isTour) {
        await bookingService.cancelTourBooking(cancelTarget._id);
      } else {
        await bookingService.cancelHotelBooking(cancelTarget._id);
      }

      toast.success('Booking cancelled successfully.');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancelTarget(null);
    }
  };

  // Combine and filter bookings
  const allBookings = [...tourBookings, ...hotelBookings].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const filteredBookings = allBookings.filter((b) => {
    const isTour = Boolean(b.tour || b.bookingReference?.startsWith('WF-TR'));
    if (activeTab === 'tour') return isTour;
    if (activeTab === 'hotel') return !isTour;
    if (activeTab === 'upcoming') return b.status === 'confirmed' || b.status === 'pending';
    if (activeTab === 'completed') return b.status === 'completed';
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-cyan-600 font-bold text-xs uppercase tracking-widest block">
            Customer Dashboard
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">My Travel Bookings</h1>
          <p className="text-slate-500 text-sm">
            Manage your upcoming tours, hotel stays, view details, or cancel reservations.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          {[
            { id: 'all', label: `All (${allBookings.length})` },
            { id: 'tour', label: `Tour Bookings (${tourBookings.length})` },
            { id: 'hotel', label: `Hotel Stays (${hotelBookings.length})` },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner text="Loading your bookings..." />
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            title="No bookings found"
            message="You don't have any bookings in this category yet."
          />
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => (
              <BookingCard
                key={b._id}
                booking={b}
                onCancel={(booking) => setCancelTarget(booking)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmModal
        isOpen={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel Reservation?"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel Booking"
        type="danger"
      />
    </div>
  );
};

export default MyBookingsPage;
