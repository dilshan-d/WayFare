import TourBooking from '../Models/TourBooking.js';
import Tour from '../Models/Tour.js';
import { sendBookingConfirmationEmail } from '../services/emailService.js';

// @desc    Create new tour booking
// @route   POST /api/tour-bookings
// @access  Private
export const createTourBooking = async (req, res) => {
  try {
    const { tourId, tourDate, numberOfGuests } = req.body;

    if (!tourId || !tourDate || !numberOfGuests) {
      return res.status(400).json({ message: 'Tour, date, and guest count are required' });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    if (tour.status !== 'active') {
      return res.status(400).json({ message: 'This tour is currently unavailable for booking' });
    }

    if (Number(numberOfGuests) > tour.maxParticipants) {
      return res.status(400).json({
        message: `Number of guests exceeds maximum allowed participants (${tour.maxParticipants})`,
      });
    }

    const guests = Number(numberOfGuests);
    const totalAmount = tour.price * guests;
    const bookingReference = `WF-TR-${Math.floor(100000 + Math.random() * 900000)}`;

    const booking = await TourBooking.create({
      user: req.user._id,
      tour: tour._id,
      tourDate: new Date(tourDate),
      numberOfGuests: guests,
      totalAmount,
      bookingReference,
      status: 'confirmed',
    });

    const populatedBooking = await TourBooking.findById(booking._id)
      .populate('tour', 'name destination price duration images category')
      .populate('user', 'firstName lastName email phone');

    // Trigger Email Notification
    sendBookingConfirmationEmail({
      userEmail: req.user.email,
      userName: `${req.user.firstName} ${req.user.lastName}`,
      bookingReference,
      title: tour.name,
      type: 'Tour Package',
      date: new Date(tourDate).toDateString(),
      guests,
      totalAmount,
    });

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get user's tour bookings
// @route   GET /api/tour-bookings/my
// @access  Private
export const getMyTourBookings = async (req, res) => {
  try {
    const bookings = await TourBooking.find({ user: req.user._id })
      .populate('tour', 'name destination price duration images destinationName category')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get tour booking by ID
// @route   GET /api/tour-bookings/:id
// @access  Private
export const getTourBookingById = async (req, res) => {
  try {
    const booking = await TourBooking.findById(req.params.id)
      .populate('tour')
      .populate('user', 'firstName lastName email phone country');

    if (!booking) {
      return res.status(404).json({ message: 'Tour booking not found' });
    }

    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Cancel tour booking
// @route   PUT /api/tour-bookings/:id/cancel
// @access  Private
export const cancelTourBooking = async (req, res) => {
  try {
    const booking = await TourBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    const updated = await TourBooking.findById(booking._id).populate('tour').populate('user', 'firstName lastName email');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
