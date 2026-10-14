import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import tourService from '../services/tourService';
import bookingService from '../services/bookingService';
import paymentService from '../services/paymentService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatters';
import { FiCalendar, FiUsers, FiShield, FiCreditCard, FiCheckCircle, FiLock } from 'react-icons/fi';

export const TourBookingPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const initialDate = searchParams.get('date') || '';
  const initialGuests = Number(searchParams.get('guests')) || 1;

  const [tourDate, setTourDate] = useState(initialDate);
  const [numberOfGuests, setNumberOfGuests] = useState(initialGuests);

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        const data = await tourService.getTourById(id);
        setTour(data);
        if (!initialDate && data.availableDates?.length > 0) {
          setTourDate(new Date(data.availableDates[0]).toISOString().split('T')[0]);
        }
      } catch (err) {
        console.error('Error fetching tour for booking:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id, initialDate]);

  const handleCardNumberChange = (e) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = v.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) {
      setExpiry(`${v.slice(0, 2)}/${v.slice(2)}`);
    } else {
      setExpiry(v);
    }
  };

  const handleConfirmBookingAndPay = async (e) => {
    e.preventDefault();
    if (!tourDate) {
      toast.error('Please select a tour date.');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        toast.error('Please enter a valid 16-digit card number.');
        return;
      }
      if (!expiry || expiry.length < 5) {
        toast.error('Please enter a valid card expiry date (MM/YY).');
        return;
      }
      if (!cvv || cvv.length < 3) {
        toast.error('Please enter a valid 3-digit CVV.');
        return;
      }
    }

    try {
      setSubmitting(true);

      // Step 1: Create Tour Booking
      const booking = await bookingService.createTourBooking({
        tourId: tour._id,
        tourDate,
        numberOfGuests,
      });

      // Step 2: Process Payment
      await paymentService.processPayment({
        bookingId: booking._id,
        bookingType: 'tour',
        paymentMethod,
        amount: tour.price * numberOfGuests,
      });

      toast.success('Tour reservation & payment successful!');
      navigate(`/bookings/${booking._id}?type=tour`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking payment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading booking details..." />;
  if (error || !tour) return <ErrorState message="Could not load tour details." />;

  const totalPrice = tour.price * numberOfGuests;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-cyan-600 font-bold text-xs uppercase tracking-widest block">
            Secure Checkout
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">Complete Tour Booking</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Main Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Guest & Date Details */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6 text-left">
              <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">
                1. Schedule & Guests
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FiCalendar className="text-cyan-600" /> Select Tour Date
                  </label>
                  <input
                    type="date"
                    value={tourDate}
                    onChange={(e) => setTourDate(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FiUsers className="text-cyan-600" /> Number of Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={tour.maxParticipants}
                    value={numberOfGuests}
                    onChange={(e) => setNumberOfGuests(Math.max(1, Number(e.target.value)))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">Maximum allowed: {tour.maxParticipants} guests</p>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6 text-left">
              <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4 flex items-center justify-between">
                <span>2. Payment Method</span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <FiLock className="w-3.5 h-3.5" /> 256-bit Encrypted
                </span>
              </h3>

              {/* Payment Tabs */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border text-center transition flex flex-col items-center gap-2 cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-cyan-600 bg-cyan-50/50 text-cyan-900 font-bold shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 font-medium'
                  }`}
                >
                  <FiCreditCard className="w-6 h-6 text-cyan-600" />
                  <span className="text-xs">Credit/Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('online')}
                  className={`p-4 rounded-2xl border text-center transition flex flex-col items-center gap-2 cursor-pointer ${
                    paymentMethod === 'online'
                      ? 'border-cyan-600 bg-cyan-50/50 text-cyan-900 font-bold shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 font-medium'
                  }`}
                >
                  <FiCheckCircle className="w-6 h-6 text-cyan-600" />
                  <span className="text-xs">Online Banking / UPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-2xl border text-center transition flex flex-col items-center gap-2 cursor-pointer ${
                    paymentMethod === 'cash'
                      ? 'border-cyan-600 bg-cyan-50/50 text-cyan-900 font-bold shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 font-medium'
                  }`}
                >
                  <FiShield className="w-6 h-6 text-cyan-600" />
                  <span className="text-xs">Pay at Tour Start</span>
                </button>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8892"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder={`${user?.firstName || 'John'} ${user?.lastName || 'Doe'}`}
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={handleExpiryChange}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        maxLength="4"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'online' && (
                <div className="p-4 bg-cyan-50 rounded-2xl text-xs text-cyan-800 font-medium">
                  Instant online portal routing will generate payment confirmation immediately.
                </div>
              )}

              {paymentMethod === 'cash' && (
                <div className="p-4 bg-amber-50 rounded-2xl text-xs text-amber-800 font-medium">
                  Your reservation will be confirmed. You can complete the cash payment directly on tour arrival day.
                </div>
              )}

              <button
                onClick={handleConfirmBookingAndPay}
                disabled={submitting}
                className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-cyan-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Processing Payment...' : `Pay ${formatCurrency(totalPrice)} & Confirm Booking`}
              </button>
            </div>
          </div>

          {/* Pricing Summary Side */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl space-y-6 text-left">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Booking Summary
            </h3>

            <div className="space-y-3">
              <img
                src={tour.images?.[0] || 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=600&q=80'}
                alt={tour.name}
                className="w-full h-36 object-cover rounded-2xl"
              />
              <h4 className="font-bold text-slate-900 text-base">{tour.name}</h4>
              <p className="text-xs text-slate-500">{tour.duration} Days • {tour.category}</p>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Base Rate</span>
                <span>{formatCurrency(tour.price)} / guest</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Guests</span>
                <span>{numberOfGuests}</span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between font-black text-slate-900 text-lg">
                <span>Total Amount</span>
                <span className="text-cyan-600">{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourBookingPage;
