import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiStar, FiMapPin, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export const TourCard = ({ tour }) => {
  const { formatPrice } = useAuth();
  if (!tour) return null;

  const image =
    tour.images && tour.images.length > 0
      ? tour.images[0]
      : 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80';

  const destinationName =
    tour.destination?.name || tour.destinationName || tour.destination || 'Sri Lanka';

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Image & Badges */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={tour.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent"></div>

        {/* Category Badge */}
        <span className="absolute top-4 left-4 px-3 py-1 bg-cyan-600/90 backdrop-blur-md rounded-full text-xs font-bold text-white shadow-xs">
          {tour.category || 'Tour Package'}
        </span>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-slate-800 shadow-xs flex items-center gap-1">
          <FiStar className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{tour.rating || 4.8}</span>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-3 left-4 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-lg text-xs font-medium text-white flex items-center gap-1.5">
          <FiClock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{tour.duration} {tour.duration === 1 ? 'Day' : 'Days'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 mb-1">
            <FiMapPin className="w-3.5 h-3.5" />
            <span>{destinationName}</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition line-clamp-2">
            {tour.name}
          </h3>

          <p className="text-slate-500 text-sm mt-2 line-clamp-2 leading-relaxed">
            {tour.description}
          </p>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Starting from</span>
            <span className="text-xl font-black text-slate-900">
              {formatPrice(tour.price)}
              <span className="text-xs font-normal text-slate-500"> / person</span>
            </span>
          </div>

          <Link
            to={`/tours/${tour._id}`}
            className="px-4 py-2 bg-slate-900 group-hover:bg-cyan-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            View Tour <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
