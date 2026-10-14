import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid,
  FiUsers,
  FiMapPin,
  FiCompass,
  FiHome,
  FiKey,
  FiBookmark,
  FiStar,
  FiLogOut,
  FiArrowLeft,
} from 'react-icons/fi';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: FiGrid },
    { label: 'Users', path: '/admin/users', icon: FiUsers },
    { label: 'Destinations', path: '/admin/destinations', icon: FiMapPin },
    { label: 'Tours', path: '/admin/tours', icon: FiCompass },
    { label: 'Hotels', path: '/admin/hotels', icon: FiHome },
    { label: 'Rooms', path: '/admin/rooms', icon: FiKey },
    { label: 'Bookings', path: '/admin/bookings', icon: FiBookmark },
    { label: 'Reviews', path: '/admin/reviews', icon: FiStar },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-left">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 p-6 flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div className="space-y-6">
          {/* Admin Header */}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-sky-400 flex items-center justify-center text-white font-bold text-lg">
                W
              </div>
              <span className="text-xl font-black text-white">
                WAY<span className="text-cyan-400">ADMIN</span>
              </span>
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider"
            >
              <FiArrowLeft className="w-3.5 h-3.5" /> Back to Main Site
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition ${
                    active
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Account Info */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={user?.firstName}
              className="w-9 h-9 rounded-full object-cover border border-cyan-500"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full py-2 bg-slate-800 hover:bg-red-900/50 text-red-400 hover:text-red-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiLogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
