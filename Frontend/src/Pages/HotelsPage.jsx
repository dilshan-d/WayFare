import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import HotelCard from '../components/HotelCard';
import SkeletonGrid from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import hotelService from '../services/hotelService';
import { FiFilter, FiSearch, FiDollarSign, FiStar, FiRefreshCw } from 'react-icons/fi';

export const HotelsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(searchParams.get('destination') || '');
  const [minPrice, setMinPrice] = useState('');
  const [rating, setRating] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 9,
      };

      if (search) params.search = search;
      if (minPrice) params.minPrice = minPrice;
      if (rating) params.rating = rating;

      const data = await hotelService.getHotels(params);
      setHotels(data.hotels || []);
      setTotalPages(data.pages || 1);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [search, minPrice, rating, currentPage]);

  const resetFilters = () => {
    setSearch('');
    setMinPrice('');
    setRating('');
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-cyan-600 font-bold text-xs uppercase tracking-widest block">
            Luxury Stay & Comfort
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Hotels & Resorts
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Choose from handpicked luxury eco-resorts, colonial manors, and beachfront havens.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar Filter Panel */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 lg:sticky lg:top-24 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FiFilter className="text-cyan-600" /> Filter Hotels
              </h3>
              <button
                onClick={resetFilters}
                className="text-xs text-cyan-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <FiRefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Location / Hotel Name
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Ella, Galle, Kandy..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
                />
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Min Starting Price ($)
              </label>
              <div className="relative">
                <FiDollarSign className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="e.g. 100"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Rating
              </label>
              <select
                value={rating}
                onChange={(e) => {
                  setRating(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.8">4.8+ Stars</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <SkeletonGrid count={6} />
            ) : hotels.length === 0 ? (
              <EmptyState
                title="No hotels found"
                message="Try adjusting your location or price filters."
                actionText="Reset Filters"
                onAction={resetFilters}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hotels.map((hotel) => (
                    <HotelCard key={hotel._id} hotel={hotel} />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;
