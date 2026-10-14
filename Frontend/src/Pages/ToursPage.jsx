import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TourCard from '../components/TourCard';
import SkeletonGrid from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import tourService from '../services/tourService';
import { FiFilter, FiSearch, FiDollarSign, FiClock, FiStar, FiRefreshCw } from 'react-icons/fi';

export const ToursPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('destination') || '');
  const [category, setCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [rating, setRating] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 9,
      };

      if (search) params.search = search;
      if (category) params.category = category;
      if (maxPrice) params.maxPrice = maxPrice;
      if (duration) params.duration = duration;
      if (rating) params.rating = rating;

      const data = await tourService.getTours(params);
      setTours(data.tours || []);
      setTotalPages(data.pages || 1);
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, [search, category, maxPrice, duration, rating, currentPage]);

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setMaxPrice('');
    setDuration('');
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
            Curated Expeditions
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Tour Packages
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Find the perfect guided journey with expert naturalists, cultural immersion, and luxury comfort.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar Filter Panel */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 lg:sticky lg:top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FiFilter className="text-cyan-600" /> Filter Tours
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
                Search Keyword
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
                  placeholder="Destination, tour name..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
              >
                <option value="">All Categories</option>
                <option value="Adventure">Adventure</option>
                <option value="Cultural">Cultural</option>
                <option value="Wildlife">Wildlife</option>
                <option value="Nature">Nature</option>
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Max Price ($)
              </label>
              <div className="relative">
                <FiDollarSign className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="e.g. 300"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
                />
              </div>
            </div>

            {/* Duration Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Duration (Days)
              </label>
              <select
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
              >
                <option value="">Any Duration</option>
                <option value="1">1 Day</option>
                <option value="2">2 Days</option>
                <option value="3">3 Days</option>
                <option value="4">4+ Days</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Minimum Rating
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

          {/* Tour Cards Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <SkeletonGrid count={6} />
            ) : tours.length === 0 ? (
              <EmptyState
                title="No tours match your criteria"
                message="Try relaxing your filters or searching for another destination."
                actionText="Reset Filters"
                onAction={resetFilters}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tours.map((tour) => (
                    <TourCard key={tour._id} tour={tour} />
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

export default ToursPage;
