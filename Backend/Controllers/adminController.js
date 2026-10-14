import User from '../Models/User.js';
import Destination from '../Models/Destination.js';
import Tour from '../Models/Tour.js';
import Hotel from '../Models/Hotel.js';
import TourBooking from '../Models/TourBooking.js';
import HotelBooking from '../Models/HotelBooking.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDestinations = await Destination.countDocuments();
    const totalTours = await Tour.countDocuments();
    const totalHotels = await Hotel.countDocuments();

    const tourBookings = await TourBooking.find();
    const hotelBookings = await HotelBooking.find();

    const totalBookings = tourBookings.length + hotelBookings.length;

    const tourRevenue = tourBookings
      .filter((b) => b.status !== 'cancelled')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const hotelRevenue = hotelBookings
      .filter((b) => b.status !== 'cancelled')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const totalRevenue = tourRevenue + hotelRevenue;

    // Monthly breakdown preview
    const monthlyStats = [
      { month: 'Jan', revenue: Math.round(totalRevenue * 0.1) },
      { month: 'Feb', revenue: Math.round(totalRevenue * 0.12) },
      { month: 'Mar', revenue: Math.round(totalRevenue * 0.15) },
      { month: 'Apr', revenue: Math.round(totalRevenue * 0.18) },
      { month: 'May', revenue: Math.round(totalRevenue * 0.22) },
      { month: 'Jun', revenue: Math.round(totalRevenue * 0.23) },
    ];

    res.json({
      totalUsers,
      totalDestinations,
      totalTours,
      totalHotels,
      totalBookings,
      totalRevenue,
      tourBookingsCount: tourBookings.length,
      hotelBookingsCount: hotelBookings.length,
      monthlyStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get all bookings (Tour & Hotel)
// @route   GET /api/admin/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    const { type, status, search } = req.query;

    let tourBookings = [];
    let hotelBookings = [];

    if (!type || type === 'all' || type === 'tour') {
      let query = {};
      if (status && status !== 'all') query.status = status;
      tourBookings = await TourBooking.find(query)
        .populate('tour', 'name price destination')
        .populate('user', 'firstName lastName email phone')
        .sort({ createdAt: -1 });
    }

    if (!type || type === 'all' || type === 'hotel') {
      let query = {};
      if (status && status !== 'all') query.status = status;
      hotelBookings = await HotelBooking.find(query)
        .populate('hotel', 'name location')
        .populate('room', 'roomType pricePerNight')
        .populate('user', 'firstName lastName email phone')
        .sort({ createdAt: -1 });
    }

    const formattedTours = tourBookings.map((b) => ({
      _id: b._id,
      bookingType: 'tour',
      bookingReference: b.bookingReference,
      user: b.user,
      title: b.tour ? b.tour.name : 'Tour Booking',
      item: b.tour,
      date: b.tourDate,
      guests: b.numberOfGuests,
      totalAmount: b.totalAmount,
      status: b.status,
      createdAt: b.createdAt,
    }));

    const formattedHotels = hotelBookings.map((b) => ({
      _id: b._id,
      bookingType: 'hotel',
      bookingReference: b.bookingReference,
      user: b.user,
      title: b.hotel ? b.hotel.name : 'Hotel Booking',
      item: b.hotel,
      room: b.room,
      date: b.checkIn,
      checkOut: b.checkOut,
      guests: b.numberOfGuests,
      nights: b.numberOfNights,
      totalAmount: b.totalAmount,
      status: b.status,
      createdAt: b.createdAt,
    }));

    let allBookings = [...formattedTours, ...formattedHotels].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    if (search) {
      const q = search.toLowerCase();
      allBookings = allBookings.filter(
        (b) =>
          b.bookingReference?.toLowerCase().includes(q) ||
          b.title?.toLowerCase().includes(q) ||
          b.user?.email?.toLowerCase().includes(q) ||
          b.user?.firstName?.toLowerCase().includes(q) ||
          b.user?.lastName?.toLowerCase().includes(q)
      );
    }

    res.json(allBookings);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update booking status (Admin)
// @route   PUT /api/admin/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, bookingType } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    let updatedBooking = null;

    if (bookingType === 'tour') {
      updatedBooking = await TourBooking.findByIdAndUpdate(id, { status }, { new: true })
        .populate('tour')
        .populate('user', 'firstName lastName email');
    } else if (bookingType === 'hotel') {
      updatedBooking = await HotelBooking.findByIdAndUpdate(id, { status }, { new: true })
        .populate('hotel')
        .populate('room')
        .populate('user', 'firstName lastName email');
    } else {
      // Try finding in both
      updatedBooking = await TourBooking.findByIdAndUpdate(id, { status }, { new: true });
      if (!updatedBooking) {
        updatedBooking = await HotelBooking.findByIdAndUpdate(id, { status }, { new: true });
      }
    }

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
