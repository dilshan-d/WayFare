import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import destinationService from '../services/destinationService';
import tourService from '../services/tourService';
import hotelService from '../services/hotelService';
import TourCard from '../components/TourCard';
import HotelCard from '../components/HotelCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { FiMapPin, FiCalendar, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';

export const DestinationDetailsPage = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [tours, setTours] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(false);
        const dest = await destinationService.getDestinationById(id);
        setDestination(dest);

        // Fetch associated tours & hotels for this destination
        const [tourData, hotelData] = await Promise.all([
          tourService.getTours({ destination: id }),
          hotelService.getHotels({ destination: id }),
        ]);

        setTours(tourData.tours || []);
        setHotels(hotelData.hotels || []);
      } catch (err) {
        console.error('Error fetching destination details:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <LoadingSpinner text="Loading destination details..." />;
  if (error || !destination)
    return <ErrorState message="Could not find destination details." />;

  const allImages = destination.images && destination.images.length > 0 ? destination.images : [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
  ];

  const heroImage = allImages[activeImageIndex] || allImages[0];


  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Banner */}
      <div className="relative h-96 sm:h-[420px] w-full bg-slate-900 overflow-hidden">
        <img src={heroImage} alt={destination.name} className="w-full h-full object-cover opacity-80 transition-all duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent"></div>

        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-8 flex flex-col justify-end pb-10">
          <Link
            to="/destinations"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full w-fit"
          >
            <FiArrowLeft className="w-4 h-4" /> All Destinations
          </Link>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm uppercase tracking-widest mb-1">
            <FiMapPin /> {destination.country}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">{destination.name}</h1>

          {/* All Images Thumbnail Strip for Destination */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
              {allImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`shrink-0 w-16 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-cyan-400 ring-2 ring-cyan-400/40 scale-105' : 'border-white/30 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>


      {/* Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-6 relative z-10 space-y-12">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">About {destination.name}</h2>
            <p className="text-slate-600 leading-relaxed">{destination.description}</p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3">Key Highlights</h3>
            
            <div className="flex items-start gap-3 text-sm">
              <FiCalendar className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">Best Time to Visit</span>
                <span className="text-slate-600">{destination.bestTimeToVisit || 'Year-round'}</span>
              </div>
            </div>

            {destination.attractions && destination.attractions.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-800 text-sm block">Top Attractions</span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {destination.attractions.map((attr, idx) => (
                    <li key={idx} className="flex items-center gap-2 font-medium">
                      <FiCheckCircle className="text-cyan-600 w-3.5 h-3.5" /> {attr}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Available Tours */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Tours in {destination.name}</h2>
            <span className="text-sm font-semibold text-slate-500">{tours.length} Available</span>
          </div>

          {tours.length === 0 ? (
            <p className="text-slate-500 text-sm italic bg-white p-6 rounded-2xl border border-slate-100">
              No specific tour packages found for this destination at the moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tours.map((tour) => (
                <TourCard key={tour._id} tour={tour} />
              ))}
            </div>
          )}
        </div>

        {/* Available Hotels */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Hotels in {destination.name}</h2>
            <span className="text-sm font-semibold text-slate-500">{hotels.length} Available</span>
          </div>

          {hotels.length === 0 ? (
            <p className="text-slate-500 text-sm italic bg-white p-6 rounded-2xl border border-slate-100">
              No hotels listed for this destination yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {hotels.map((hotel) => (
                <HotelCard key={hotel._id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DestinationDetailsPage;
