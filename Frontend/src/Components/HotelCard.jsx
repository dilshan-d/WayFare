import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export const HotelCard = ({ hotel }) => {
  const { formatPrice } = useAuth();
  if (!hotel) return null;

  const image =
    hotel.images && hotel.images.length > 0
      ? hotel.images[0]
      : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

  const destinationName =
    hotel.destination?.name || hotel.location || 'Sri Lanka';

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent"></div>

        {/* Rating */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-slate-800 shadow-xs flex items-center gap-1">
          <FiStar className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{hotel.rating || 4.5}</span>
        </div>

        {/* Location */}
        <span className="absolute bottom-4 left-4 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-full text-xs font-medium text-white flex items-center gap-1.5">
          <FiMapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span>{destinationName}</span>
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-cyan-600 transition line-clamp-1">
            {hotel.name}
          </h3>

          <p className="text-slate-500 text-sm mt-1.5 line-clamp-2 leading-relaxed">
            {hotel.description}
          </p>

          {/* Amenities Preview */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium border border-slate-100 flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                  {amenity}
                </span>
              ))}
              {hotel.amenities.length > 3 && (
                <span className="px-2 py-1 bg-slate-50 text-slate-400 rounded-lg text-xs font-medium">
                  +{hotel.amenities.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">From</span>
            <span className="text-xl font-black text-slate-900">
              {formatPrice(hotel.startingPrice)}
              <span className="text-xs font-normal text-slate-500"> / night</span>
            </span>
          </div>

          <Link
            to={`/hotels/${hotel._id}`}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            View Rooms <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
