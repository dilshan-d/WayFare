import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import tourService from '../services/tourService';
import reviewService from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import ReviewCard from '../components/ReviewCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  FiClock,
  FiUsers,
  FiStar,
  FiMapPin,
  FiCheckCircle,
  FiCalendar,
  FiArrowRight,
  FiArrowLeft,
  FiMessageSquare,
} from 'react-icons/fi';

export const TourDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tour, setTour] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Booking Widget State
  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState(1);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        setLoading(true);
        setError(false);
        const data = await tourService.getTourById(id);
        setTour(data);

        // Pre-select first date if available
        if (data.availableDates && data.availableDates.length > 0) {
          const formatted = new Date(data.availableDates[0]).toISOString().split('T')[0];
          setSelectedDate(formatted);
        } else {
          setSelectedDate(new Date().toISOString().split('T')[0]);
        }

        const revs = await reviewService.getReviews({ targetType: 'Tour', targetId: id });
        setReviews(revs || []);
      } catch (err) {
        console.error('Error loading tour details:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTourDetails();
  }, [id]);

  const handleBookNow = () => {
    if (!user) {
      toast.error('Please sign in to proceed with your booking.');
      navigate('/login', { state: { from: { pathname: `/tours/${id}` } } });
      return;
    }

    if (!selectedDate) {
      toast.error('Please select a tour date.');
      return;
    }

    navigate(`/tours/${id}/book?date=${selectedDate}&guests=${guests}`);
  };

  const handleAddReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Please enter your review comment.');
      return;
    }

    try {
      setSubmittingReview(true);
      const created = await reviewService.createReview({
        targetType: 'Tour',
        targetId: id,
        rating: newRating,
        comment: newComment,
      });

      setReviews([created, ...reviews]);
      toast.success('Thank you! Your review has been submitted.');
      setReviewModalOpen(false);
      setNewComment('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading tour details..." />;
  if (error || !tour) return <ErrorState message="Tour package details could not be loaded." />;

  const allImages = tour.images && tour.images.length > 0 ? tour.images : [
    'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=600&q=80',
  ];

  const currentHeroImage = allImages[activeImageIndex] || allImages[0];


  const destinationName =
    tour.destination?.name || tour.destinationName || 'Sri Lanka';

  const totalPrice = tour.price * guests;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Banner Breadcrumb */}
      <div className="bg-slate-900 text-white py-4 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider transition"
          >
            <FiArrowLeft className="w-4 h-4" /> Back to Tours
          </Link>
          <span className="text-xs font-semibold text-cyan-400">{tour.category}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Title Header */}
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2 text-cyan-600 font-bold text-sm">
            <FiMapPin /> <span>{destinationName}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {tour.name}
          </h1>
          <div className="flex items-center gap-6 text-sm text-slate-500 font-medium pt-1">
            <span className="flex items-center gap-1.5 text-amber-500 font-bold">
              <FiStar className="fill-amber-400" /> {tour.rating || 4.8} ({reviews.length} reviews)
            </span>
            <span className="flex items-center gap-1.5">
              <FiClock className="text-cyan-600" /> {tour.duration} {tour.duration === 1 ? 'Day' : 'Days'}
            </span>
            <span className="flex items-center gap-1.5">
              <FiUsers className="text-cyan-600" /> Max {tour.maxParticipants} Guests
            </span>
          </div>
        </div>

        {/* Main Gallery */}
        <div className="space-y-3">
          <div className="relative h-[380px] sm:h-[480px] w-full rounded-3xl overflow-hidden shadow-lg border border-slate-100 bg-slate-900">
            <img src={currentHeroImage} alt={tour.name} className="w-full h-full object-cover transition-all duration-300" />
            <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/10">
              Photo {activeImageIndex + 1} of {allImages.length}
            </div>
          </div>

          {/* All Images Thumbnail Strip */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {allImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative shrink-0 w-24 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-cyan-500 ring-2 ring-cyan-500/30 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>


        {/* Content & Booking Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-10 text-left">
            {/* Description */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Tour Description</h3>
              <p className="text-slate-600 leading-relaxed">{tour.description}</p>
            </div>

            {/* Included Services */}
            {tour.includedServices && tour.includedServices.length > 0 && (
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-900">What's Included</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tour.includedServices.map((service, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                      <FiCheckCircle className="text-cyan-600 w-5 h-5 shrink-0" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Tour Itinerary</h3>
                <div className="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                  {tour.itinerary.map((dayItem, idx) => (
                    <div key={idx} className="relative pl-10 space-y-1">
                      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-cyan-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
                        {dayItem.day || idx + 1}
                      </div>
                      <h4 className="text-base font-bold text-slate-900">
                        Day {dayItem.day || idx + 1}: {dayItem.title}
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{dayItem.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Customer Reviews</h3>
                  <p className="text-xs text-slate-400 mt-1">Authentic experiences shared by guests</p>
                </div>
                {user && (
                  <button
                    onClick={() => setReviewModalOpen(true)}
                    className="px-4 py-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                  >
                    <FiMessageSquare className="w-4 h-4" /> Write Review
                  </button>
                )}
              </div>

              {reviews.length === 0 ? (
                <p className="text-slate-500 text-sm italic">
                  No reviews yet for this tour. Be the first to leave a review!
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {reviews.map((rev) => (
                    <ReviewCard key={rev._id} review={rev} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Booking Widget Panel */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl space-y-6 lg:sticky lg:top-24 text-left">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-medium block">Price per person</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-slate-900">
                  {formatCurrency(tour.price)}
                </span>
                <span className="text-xs text-slate-500">/ guest</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Date Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FiCalendar className="text-cyan-600" /> Select Date
                </label>
                {tour.availableDates && tour.availableDates.length > 0 ? (
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  >
                    {tour.availableDates.map((d, i) => {
                      const formatted = new Date(d).toISOString().split('T')[0];
                      return (
                        <option key={i} value={formatted}>
                          {formatDate(d)}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                )}
              </div>

              {/* Guest Count */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FiUsers className="text-cyan-600" /> Guests
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-10 h-10 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-slate-900 text-base">
                    {guests} {guests === 1 ? 'Guest' : 'Guests'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setGuests(Math.min(tour.maxParticipants, guests + 1))}
                    className="w-10 h-10 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Total Price Breakdown */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>{formatCurrency(tour.price)} × {guests} Guests</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-extrabold text-slate-900 text-base">
                <span>Total</span>
                <span className="text-cyan-600">{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            <button
              onClick={handleBookNow}
              className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-cyan-600/30 transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
            >
              Book Now <FiArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Write a Review"
      >
        <form onSubmit={handleAddReviewSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className="p-1 text-amber-400 focus:outline-none"
                >
                  <FiStar
                    className={`w-7 h-7 ${star <= newRating ? 'fill-amber-400' : 'text-slate-300'}`}
                  />
                </button>
              ))}
              <span className="ml-2 font-bold text-sm text-slate-700">{newRating} Stars</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Review Comment *
            </label>
            <textarea
              rows="4"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Describe your tour experience..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setReviewModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingReview}
              className="px-5 py-2 text-sm font-bold text-white bg-cyan-600 rounded-xl shadow-md"
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TourDetailsPage;
