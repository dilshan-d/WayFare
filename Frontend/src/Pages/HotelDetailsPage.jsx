import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import hotelService from '../services/hotelService';
import roomService from '../services/roomService';
import reviewService from '../services/reviewService';
import RoomCard from '../components/RoomCard';
import ReviewCard from '../components/ReviewCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatters';
import {
  FiMapPin,
  FiStar,
  FiCheckCircle,
  FiArrowLeft,
  FiMessageSquare,
} from 'react-icons/fi';

export const HotelDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        setLoading(true);
        setError(false);
        const data = await hotelService.getHotelById(id);
        setHotel(data);

        const [roomData, reviewData] = await Promise.all([
          roomService.getRooms({ hotel: id }),
          reviewService.getReviews({ targetType: 'Hotel', targetId: id }),
        ]);

        setRooms(roomData || []);
        setReviews(reviewData || []);
      } catch (err) {
        console.error('Error loading hotel details:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id]);

  const handleBookRoom = (room) => {
    if (!user) {
      toast.error('Please sign in to book a hotel room.');
      navigate('/login', { state: { from: { pathname: `/hotels/${id}` } } });
      return;
    }

    navigate(`/hotels/${id}/book?roomId=${room._id}`);
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
        targetType: 'Hotel',
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

  if (loading) return <LoadingSpinner text="Loading hotel details..." />;
  if (error || !hotel) return <ErrorState message="Hotel details could not be loaded." />;

  const allImages = hotel.images && hotel.images.length > 0 ? hotel.images : [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
  ];

  const currentHeroImage = allImages[activeImageIndex] || allImages[0];


  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Breadcrumb */}
      <div className="bg-slate-900 text-white py-4 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/hotels"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider transition"
          >
            <FiArrowLeft className="w-4 h-4" /> Back to Hotels
          </Link>
          <span className="text-xs font-semibold text-cyan-400">{hotel.location}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Title Header */}
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2 text-cyan-600 font-bold text-sm">
            <FiMapPin /> <span>{hotel.location} • {hotel.address}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {hotel.name}
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-500 font-medium pt-1">
            <span className="flex items-center gap-1.5 text-amber-500 font-bold">
              <FiStar className="fill-amber-400" /> {hotel.rating || 4.5} ({reviews.length} reviews)
            </span>
            <span className="text-slate-400">|</span>
            <span>Starting from <strong className="text-slate-900">{formatCurrency(hotel.startingPrice)}</strong> / night</span>
          </div>
        </div>

        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative h-[380px] sm:h-[480px] w-full rounded-3xl overflow-hidden shadow-lg border border-slate-100 bg-slate-900">
            <img src={currentHeroImage} alt={hotel.name} className="w-full h-full object-cover transition-all duration-300" />
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


        {/* Overview & Amenities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Hotel Overview</h3>
            <p className="text-slate-600 leading-relaxed">{hotel.description}</p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Property Amenities
            </h3>
            {hotel.amenities && hotel.amenities.length > 0 && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
                {hotel.amenities.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 font-medium">
                    <FiCheckCircle className="text-cyan-600 w-4 h-4 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Available Rooms Section */}
        <div className="space-y-6 text-left">
          <h2 className="text-2xl font-bold text-slate-900">Select Room</h2>

          {rooms.length === 0 ? (
            <p className="text-slate-500 text-sm italic bg-white p-8 rounded-3xl border border-slate-100">
              No specific rooms available for online booking at this time.
            </p>
          ) : (
            <div className="space-y-4">
              {rooms.map((room) => (
                <RoomCard key={room._id} room={room} onBook={handleBookRoom} />
              ))}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6 text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Guest Reviews</h3>
              <p className="text-xs text-slate-400 mt-1">Verified feedback from past guests</p>
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
              No reviews recorded for this hotel yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <ReviewCard key={rev._id} review={rev} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Write Hotel Review"
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
              placeholder="Tell us about your stay..."
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

export default HotelDetailsPage;
