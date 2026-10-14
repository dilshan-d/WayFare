import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CURRENCY_RATES } from '../utils/formatters';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiUser,
  FiLogOut,
  FiGrid,
  FiBookmark,
  FiMenu,
  FiX,
  FiChevronDown,
  FiDollarSign,
} from 'react-icons/fi';

export const Navbar = () => {
  const { user, logout, isAdmin, currency, changeCurrency } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="w-full z-40 relative">
      {/* Top Banner Bar */}
      <div className="bg-[#00B4D8] text-white text-xs font-medium py-2 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2 border-b border-cyan-400/30">
        <div className="flex items-center flex-wrap gap-4 sm:gap-6">
          <a href="mailto:info@wayfare.com" className="flex items-center gap-1.5 hover:text-cyan-100 transition">
            <FiMail className="w-3.5 h-3.5" /> info@wayfare.com
          </a>
          <a href="tel:+1234567890" className="flex items-center gap-1.5 hover:text-cyan-100 transition">
            <FiPhone className="w-3.5 h-3.5" /> +1 234 567 890
          </a>
          <span className="hidden md:flex items-center gap-1.5 text-cyan-50">
            <FiMapPin className="w-3.5 h-3.5" /> Boatway & Morris St, New York
          </span>
        </div>

        {/* Currency Selector */}
        <div className="flex items-center gap-4 ml-auto relative">
          <button
            onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer font-bold text-xs"
          >
            <FiDollarSign className="w-3.5 h-3.5" />
            <span>{CURRENCY_RATES[currency]?.label || currency}</span>
            <FiChevronDown className="w-3 h-3" />
          </button>

          {currencyDropdownOpen && (
            <div
              className="absolute right-0 top-8 w-36 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-fade-in"
              onMouseLeave={() => setCurrencyDropdownOpen(false)}
            >
              {Object.keys(CURRENCY_RATES).map((currKey) => (
                <button
                  key={currKey}
                  onClick={() => {
                    changeCurrency(currKey);
                    setCurrencyDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-1.5 text-xs font-bold transition flex items-center justify-between hover:bg-cyan-50 ${
                    currency === currKey ? 'text-cyan-600 font-extrabold bg-cyan-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{CURRENCY_RATES[currKey].label}</span>
                  {currency === currKey && <span className="text-cyan-600 font-bold">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-400 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              W
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
              WAY<span className="text-cyan-600">FARE</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-700">
            <Link
              to="/"
              className={`hover:text-cyan-600 transition relative py-1 ${
                isActive('/') ? 'text-cyan-600 font-bold' : ''
              }`}
            >
              Home
              {isActive('/') && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600 rounded-full"></span>}
            </Link>
            <Link
              to="/destinations"
              className={`hover:text-cyan-600 transition relative py-1 ${
                isActive('/destinations') ? 'text-cyan-600 font-bold' : ''
              }`}
            >
              Destinations
              {isActive('/destinations') && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600 rounded-full"></span>}
            </Link>
            <Link
              to="/tours"
              className={`hover:text-cyan-600 transition relative py-1 ${
                isActive('/tours') ? 'text-cyan-600 font-bold' : ''
              }`}
            >
              Tours
              {isActive('/tours') && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600 rounded-full"></span>}
            </Link>
            <Link
              to="/hotels"
              className={`hover:text-cyan-600 transition relative py-1 ${
                isActive('/hotels') ? 'text-cyan-600 font-bold' : ''
              }`}
            >
              Hotels
              {isActive('/hotels') && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600 rounded-full"></span>}
            </Link>
            {user && (
              <Link
                to="/my-bookings"
                className={`hover:text-cyan-600 transition relative py-1 ${
                  isActive('/my-bookings') ? 'text-cyan-600 font-bold' : ''
                }`}
              >
                My Bookings
                {isActive('/my-bookings') && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600 rounded-full"></span>}
              </Link>
            )}
          </div>

          {/* User Auth Buttons / Profile Dropdown */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer"
                >
                  <img
                    src={user.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={user.firstName}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <span className="text-sm font-semibold text-slate-800">
                    {user.firstName}
                  </span>
                  <FiChevronDown className="w-4 h-4 text-slate-400 mr-1" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-cyan-100 text-cyan-800 rounded-full uppercase">
                          Admin Role
                        </span>
                      )}
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-cyan-600 hover:bg-cyan-50 transition"
                      >
                        <FiGrid className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                      <FiUser className="w-4 h-4" /> Profile & Account
                    </Link>

                    <Link
                      to="/my-bookings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                      <FiBookmark className="w-4 h-4" /> My Bookings
                    </Link>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition text-left cursor-pointer"
                      >
                        <FiLogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-cyan-600 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
          >
            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3 pb-2 animate-fade-in">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              Home
            </Link>
            <Link
              to="/destinations"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              Destinations
            </Link>
            <Link
              to="/tours"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              Tours
            </Link>
            <Link
              to="/hotels"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              Hotels
            </Link>
            {user && (
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl"
              >
                My Bookings
              </Link>
            )}

            {user ? (
              <div className="border-t border-slate-100 pt-3 mt-2 flex flex-col gap-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
                >
                  Profile ({user.firstName})
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-sm font-bold text-cyan-600 hover:bg-cyan-50 rounded-xl"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl text-left"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="border-t border-slate-100 pt-3 mt-2 flex items-center gap-3 px-4">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 py-2.5 text-center text-sm font-semibold border border-slate-200 text-slate-800 rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 py-2.5 text-center text-sm font-semibold bg-cyan-600 text-white rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
