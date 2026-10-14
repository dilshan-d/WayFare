import React, { useEffect, useState } from 'react';
import DestinationCard from '../components/DestinationCard';
import SkeletonGrid from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import destinationService from '../services/destinationService';
import { FiSearch, FiGlobe } from 'react-icons/fi';

export const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const data = await destinationService.getDestinations({
        search,
        country: countryFilter,
        page: currentPage,
        limit: 8,
      });
      setDestinations(data.destinations || []);
      setTotalPages(data.pages || 1);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [search, countryFilter, currentPage]);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-cyan-600 font-bold text-xs uppercase tracking-widest block">
            World-Class Locations
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Destinations
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Discover breathtaking places, ancient wonders, tropical coastlines, and mountain hideaways.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by destination name, country..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-48">
              <FiGlobe className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
              <select
                value={countryFilter}
                onChange={(e) => {
                  setCountryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
              >
                <option value="">All Countries</option>
                <option value="Sri Lanka">Sri Lanka</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonGrid count={8} />
        ) : destinations.length === 0 ? (
          <EmptyState
            title="No destinations found"
            message="We couldn't find any destinations matching your search criteria."
            actionText="Reset Filters"
            onAction={() => {
              setSearch('');
              setCountryFilter('');
              setCurrentPage(1);
            }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinations.map((dest) => (
                <DestinationCard key={dest._id} destination={dest} />
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
  );
};

export default DestinationsPage;
