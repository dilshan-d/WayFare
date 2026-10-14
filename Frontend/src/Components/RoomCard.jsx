import React from 'react';
import { FiUsers, FiCheck, FiArrowRight } from 'react-icons/fi';
import { formatCurrency } from '../utils/formatters';

export const RoomCard = ({ room, onBook }) => {
  if (!room) return null;

  const image =
    room.images && room.images.length > 0
      ? room.images[0]
      : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col md:flex-row gap-6 items-center">
      {/* Room Image */}
      <div className="w-full md:w-64 h-48 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
        <img src={image} alt={room.roomType} className="w-full h-full object-cover" />
      </div>

      {/* Room Details */}
      <div className="flex-1 space-y-3 text-left w-full">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 bg-cyan-50 text-cyan-700 font-bold text-xs rounded-full border border-cyan-100">
            {room.roomType}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
            <FiUsers className="w-4 h-4 text-slate-400" /> Max Capacity: {room.capacity} Guests
          </span>
        </div>

        <h4 className="text-xl font-bold text-slate-900">{room.roomType} Suite</h4>
        <p className="text-slate-600 text-sm leading-relaxed">{room.description}</p>

        {/* Amenities */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {room.amenities.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md"
              >
                <FiCheck className="w-3 h-3 text-cyan-600" /> {item}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Pricing & Booking Action */}
      <div className="w-full md:w-48 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 flex flex-col items-start md:items-end justify-between self-stretch">
        <div className="text-left md:text-right">
          <span className="text-xs text-slate-400 font-medium block">Price per night</span>
          <span className="text-2xl font-black text-slate-900">
            {formatCurrency(room.pricePerNight)}
          </span>
        </div>

        <button
          onClick={() => onBook(room)}
          disabled={!room.availability}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
            room.availability
              ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-md shadow-cyan-600/20'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {room.availability ? (
            <>
              Book Room <FiArrowRight className="w-4 h-4" />
            </>
          ) : (
            'Unavailable'
          )}
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
