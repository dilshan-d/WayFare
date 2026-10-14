import React, { useEffect, useState } from 'react';
import bookingService from '../../services/bookingService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorState from '../../components/ErrorState';
import { formatCurrency } from '../../utils/formatters';
import {
  FiUsers,
  FiHome,
  FiCompass,
  FiMapPin,
  FiBookmark,
  FiDollarSign,
  FiTrendingUp,
} from 'react-icons/fi';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(false);
        const data = await bookingService.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard metrics..." />;
  if (error || !stats) return <ErrorState message="Failed to load dashboard metrics." />;

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      icon: FiUsers,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Destinations',
      value: stats.totalDestinations || 0,
      icon: FiMapPin,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Tour Packages',
      value: stats.totalTours || 0,
      icon: FiCompass,
      color: 'bg-cyan-500',
      textColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
    {
      title: 'Hotels & Resorts',
      value: stats.totalHotels || 0,
      icon: FiHome,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings || 0,
      icon: FiBookmark,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: FiDollarSign,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Admin Executive Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Overview of platform users, destinations, tours, hotels, bookings, and financial analytics.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <h3 className="text-3xl font-black text-slate-900">{card.value}</h3>
              </div>
              <div className={`w-14 h-14 rounded-2xl ${card.bgColor} ${card.textColor} flex items-center justify-center text-2xl`}>
                <Icon />
              </div>
            </div>
          );
        })}
      </div>

      {/* Breakdown & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FiTrendingUp className="text-cyan-600" /> Booking Breakdown
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-slate-700">Tour Bookings</span>
                <span className="text-cyan-600">{stats.tourBookingsCount}</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full"
                  style={{
                    width: `${
                      stats.totalBookings
                        ? (stats.tourBookingsCount / stats.totalBookings) * 100
                        : 50
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-slate-700">Hotel Bookings</span>
                <span className="text-emerald-600">{stats.hotelBookingsCount}</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{
                    width: `${
                      stats.totalBookings
                        ? (stats.hotelBookingsCount / stats.totalBookings) * 100
                        : 50
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Performance Bar Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Monthly Revenue Trend (6 Months)
          </h3>
          <div className="h-48 flex items-end justify-between gap-4 pt-6">
            {stats.monthlyStats?.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  className="w-full bg-gradient-to-t from-cyan-600 to-sky-400 rounded-t-xl transition-all duration-500"
                  style={{ height: `${Math.min(100, (m.revenue / (stats.totalRevenue || 1000)) * 100 + 20)}%` }}
                ></div>
                <span className="text-xs font-bold text-slate-500">{m.month}</span>
                <span className="text-[10px] font-semibold text-slate-400">{formatCurrency(m.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
