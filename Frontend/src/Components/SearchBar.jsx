import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiUsers, FiSearch } from 'react-icons/fi';

export const SearchBar = ({ onSearch }) => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ destination, checkIn, checkOut, guests });
    } else {
      const queryParams = new URLSearchParams();
      if (destination) queryParams.set('destination', destination);
      if (checkIn) queryParams.set('checkIn', checkIn);
      if (checkOut) queryParams.set('checkOut', checkOut);
      if (guests) queryParams.set('guests', guests);

      navigate(`/tours?${queryParams.toString()}`);
    }
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="w-full bg-white/95 backdrop-blur-xl p-4 sm:p-6 rounded-3xl shadow-2xl border border-white/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
    >
      {/* Destination */}
      <div className="flex flex-col">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <FiMapPin className="text-cyan-600 w-4 h-4" /> Destination
        </label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Where to? (e.g. Ella, Kandy)"
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
        />
      </div>

      {/* Check-In */}
      <div className="flex flex-col">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <FiCalendar className="text-cyan-600 w-4 h-4" /> Check-In
        </label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
        />
      </div>

      {/* Check-Out */}
      <div className="flex flex-col">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <FiCalendar className="text-cyan-600 w-4 h-4" /> Check-Out
        </label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
        />
      </div>

      {/* Guests */}
      <div className="flex flex-col">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <FiUsers className="text-cyan-600 w-4 h-4" /> Guests
        </label>
        <select
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
        >
          <option value="1">1 Guest</option>
          <option value="2">2 Guests</option>
          <option value="3">3 Guests</option>
          <option value="4">4 Guests</option>
          <option value="5">5+ Guests</option>
        </select>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-700 hover:to-sky-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
      >
        <FiSearch className="w-5 h-5" /> Search
      </button>
    </form>
  );
};

export default SearchBar;
