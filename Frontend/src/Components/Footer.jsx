import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiSend,
  FiMapPin,
  FiPhone,
  FiMail,
  FiGlobe,
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiYoutube,
} from 'react-icons/fi';

export const Footer = () => {
  return (
    <footer className="bg-[#0B132B] text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-sky-400 flex items-center justify-center text-white font-bold text-xl shadow-md">
                W
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-sans">
                WAY<span className="text-cyan-400">FARE</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Your journey begins here. Discover extraordinary destinations, book curated tours, and enjoy luxury hotel stays worldwide with seamless ease.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#facebook"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white flex items-center justify-center transition"
              >
                <FiFacebook className="w-4 h-4" />
              </a>
              <a
                href="#instagram"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white flex items-center justify-center transition"
              >
                <FiInstagram className="w-4 h-4" />
              </a>
              <a
                href="#twitter"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white flex items-center justify-center transition"
              >
                <FiTwitter className="w-4 h-4" />
              </a>
              <a
                href="#youtube"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white flex items-center justify-center transition"
              >
                <FiYoutube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-cyan-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="hover:text-cyan-400 transition">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/tours" className="hover:text-cyan-400 transition">
                  Tour Packages
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="hover:text-cyan-400 transition">
                  Hotels & Resorts
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#about" className="hover:text-cyan-400 transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-cyan-400 transition">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-cyan-400 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-cyan-400 transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">Contact Us</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <FiMapPin className="w-4 h-4 text-cyan-400 mt-1 shrink-0" />
                <span>Boatway & Morris St, New York, NY 10006</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiPhone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiMail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>info@wayfare.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Wayfare Travel Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-400 transition">
              Privacy
            </a>
            <a href="#terms" className="hover:text-slate-400 transition">
              Terms
            </a>
            <a href="#sitemap" className="hover:text-slate-400 transition">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
