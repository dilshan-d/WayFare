import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiArrowRight } from 'react-icons/fi';

export const DestinationCard = ({ destination }) => {
  if (!destination) return null;

  const image =
    destination.images && destination.images.length > 0
      ? destination.images[0]
      : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

        {/* Country Badge */}
        <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-slate-800 shadow-xs flex items-center gap-1">
          <FiMapPin className="w-3 h-3 text-cyan-600" />
          {destination.country}
        </span>

        {/* Name on image bottom */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white tracking-tight">{destination.name}</h3>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
          {destination.description}
        </p>

        {destination.attractions && destination.attractions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {destination.attractions.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-cyan-600 font-semibold uppercase tracking-wider">
            {destination.bestTimeToVisit || 'Popular Destination'}
          </span>
          <Link
            to={`/destinations/${destination._id}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-cyan-600 group-hover:text-cyan-700 hover:underline transition"
          >
            Explore <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
