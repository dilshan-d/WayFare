import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import DestinationCard from '../components/DestinationCard';
import TourCard from '../components/TourCard';
import HotelCard from '../components/HotelCard';
import ReviewCard from '../components/ReviewCard';
import SkeletonGrid from '../components/SkeletonLoader';
import destinationService from '../services/destinationService';
import tourService from '../services/tourService';
import hotelService from '../services/hotelService';
import reviewService from '../services/reviewService';
import {
  FiShield,
  FiAward,
  FiClock,
  FiSmile,
  FiArrowRight,
  FiCompass,
  FiStar,
} from 'react-icons/fi';

export const HomePage = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [tours, setTours] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [destRes, tourRes, hotelRes, reviewRes] = await Promise.all([
          destinationService.getDestinations({ limit: 4 }),
          tourService.getTours({ limit: 4 }),
          hotelService.getHotels({ limit: 4 }),
          reviewService.getReviews({ limit: 3 }),
        ]);

        setDestinations(destRes.destinations || []);
        setTours(tourRes.tours || []);
        setHotels(hotelRes.hotels || []);
        setReviews(reviewRes || []);
      } catch (error) {
        console.error('Error fetching home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Popular Destinations Section */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-cyan-600 font-bold text-xs uppercase tracking-widest block mb-2">
              Explore The World
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Popular Destinations
            </h2>
          </div>
          <Link
            to="/destinations"
            className="inline-flex items-center gap-2 font-bold text-sm text-cyan-600 hover:text-cyan-700 transition"
          >
            View All Destinations <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <SkeletonGrid count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination) => (
              <DestinationCard key={destination._id} destination={destination} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Tours Section */}
      <section className="py-20 px-4 sm:px-8 bg-white border-y border-slate-100 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-cyan-600 font-bold text-xs uppercase tracking-widest block mb-2">
                Handcrafted Experiences
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Featured Tour Packages
              </h2>
            </div>
            <Link
              to="/tours"
              className="inline-flex items-center gap-2 font-bold text-sm text-cyan-600 hover:text-cyan-700 transition"
            >
              View All Tours <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <SkeletonGrid count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tours.map((tour) => (
                <TourCard key={tour._id} tour={tour} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recommended Hotels Section */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-cyan-600 font-bold text-xs uppercase tracking-widest block mb-2">
              Stay In Comfort
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Recommended Hotels & Resorts
            </h2>
          </div>
          <Link
            to="/hotels"
            className="inline-flex items-center gap-2 font-bold text-sm text-cyan-600 hover:text-cyan-700 transition"
          >
            View All Hotels <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <SkeletonGrid count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotels.map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Wayfare Section */}
      <section className="py-20 px-4 sm:px-8 bg-slate-900 text-white w-full relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-cyan-400 font-bold text-xs uppercase tracking-widest block">
              The Wayfare Difference
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Why Travel With Wayfare?
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              We design unforgettable journeys backed by seamless technology, verified local guides, and best-in-class customer support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-800/60 backdrop-blur-md p-8 rounded-3xl border border-slate-700/60 space-y-4 hover:-translate-y-1 transition duration-300">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl font-bold">
                <FiShield />
              </div>
              <h3 className="text-xl font-bold">Best Price Guarantee</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Enjoy transparent pricing with zero hidden fees and price matching on all tours and hotels.
              </p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md p-8 rounded-3xl border border-slate-700/60 space-y-4 hover:-translate-y-1 transition duration-300">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center text-2xl font-bold">
                <FiAward />
              </div>
              <h3 className="text-xl font-bold">Handpicked Luxury</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Every property and itinerary is rigorously inspected to satisfy luxury standards.
              </p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md p-8 rounded-3xl border border-slate-700/60 space-y-4 hover:-translate-y-1 transition duration-300">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl font-bold">
                <FiClock />
              </div>
              <h3 className="text-xl font-bold">24/7 Concierge Support</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Our dedicated travel concierges are available round the clock before, during, and after your trip.
              </p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md p-8 rounded-3xl border border-slate-700/60 space-y-4 hover:-translate-y-1 transition duration-300">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center text-2xl font-bold">
                <FiSmile />
              </div>
              <h3 className="text-xl font-bold">100% Verified Reviews</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Real feedback from verified guests guarantees authentic experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      {reviews.length > 0 && (
        <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-cyan-600 font-bold text-xs uppercase tracking-widest block">
              Traveler Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              What Our Guests Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full my-8">
        <div className="bg-gradient-to-r from-cyan-600 to-sky-500 rounded-3xl p-10 sm:p-16 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 max-w-xl z-10">
            <h2 className="text-3xl sm:text-4xl font-black">Ready to Start Your Journey?</h2>
            <p className="text-cyan-100 text-sm leading-relaxed">
              Join thousands of happy travelers exploring incredible destinations. Book your dream adventure with Wayfare today.
            </p>
          </div>
          <Link
            to="/tours"
            className="px-8 py-4 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-2xl shadow-lg transition-transform hover:scale-105 shrink-0 z-10"
          >
            Explore All Tours
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
