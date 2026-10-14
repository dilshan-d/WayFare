import Payment from '../Models/Payment.js';
import HotelBooking from '../Models/HotelBooking.js';
import TourBooking from '../Models/TourBooking.js';
import { sendBookingConfirmationEmail } from '../services/emailService.js';

// @desc    Process payment for hotel or tour booking
// @route   POST /api/payments/process
// @access  Private
export const processPayment = async (req, res) => {
  try {
    const { bookingId, bookingType, paymentMethod = 'card', amount } = req.body;

    if (!bookingId || !bookingType) {
      return res.status(400).json({ message: 'Booking ID and booking type are required' });
    }

    let booking = null;
    let title = '';

    if (bookingType === 'hotel') {
      booking = await HotelBooking.findById(bookingId)
        .populate('hotel')
        .populate('room')
        .populate('user');
      title = booking?.hotel ? `${booking.hotel.name} Stay` : 'Hotel Booking';
    } else if (bookingType === 'tour') {
      booking = await TourBooking.findById(bookingId)
        .populate('tour')
        .populate('user');
      title = booking?.tour ? booking.tour.name : 'Tour Package';
    }

    if (!booking) {
      return res.status(404).json({ message: 'Booking record not found' });
    }

    // Generate unique transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalAmount = Number(amount) || booking.totalAmount;

    // Create Payment Document
    const payment = await Payment.create({
      user: req.user._id,
      userEmail: req.user.email,
      bookingType,
      bookingId: booking._id,
      hotelEmail: bookingType === 'hotel' ? booking.hotel?.email || 'hotel@wayfare.com' : undefined,
      tourPackageTitle: bookingType === 'tour' ? title : undefined,
      amount: finalAmount,
      paymentMethod,
      transactionId,
      status: 'completed',
      paymentDate: new Date(),
    });

    // Update Booking Status
    booking.paymentStatus = 'paid';
    booking.paymentMethod = paymentMethod;
    booking.transactionId = transactionId;
    booking.status = 'confirmed';
    await booking.save();

    // Trigger Email Receipt
    try {
      sendBookingConfirmationEmail({
        userEmail: req.user.email,
        userName: `${req.user.firstName} ${req.user.lastName}`,
        bookingReference: booking.bookingReference,
        title,
        type: bookingType === 'hotel' ? 'Hotel Suite' : 'Tour Package',
        date: bookingType === 'hotel'
          ? `${new Date(booking.checkIn).toDateString()} - ${new Date(booking.checkOut).toDateString()}`
          : new Date(booking.tourDate).toDateString(),
        guests: booking.numberOfGuests,
        totalAmount: finalAmount,
        transactionId,
      });
    } catch (emailErr) {
      console.warn('[Payment Email Notification Warning]:', emailErr.message);
    }

    res.status(201).json({
      message: 'Payment processed successfully',
      payment,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get user payment history
// @route   GET /api/payments/my
// @access  Private
export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      $or: [{ user: req.user._id }, { userEmail: req.user.email }],
    }).sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get all payments (Admin)
// @route   GET /api/payments/admin
// @access  Private/Admin
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get single payment by ID
// @route   GET /api/payments/:id
// @access  Private
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('user', 'firstName lastName email');
    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    if (payment.userEmail !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this payment' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
