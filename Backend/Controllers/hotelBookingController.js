import HotelBooking from '../Models/HotelBooking.js';
import Hotel from '../Models/Hotel.js';
import Room from '../Models/Room.js';
import { sendBookingConfirmationEmail } from '../services/emailService.js';

// @desc    Create new hotel booking
// @route   POST /api/hotel-bookings
// @access  Private
export const createHotelBooking = async (req, res) => {
  try {
    const { hotelId, roomId, checkIn, checkOut, numberOfGuests, numberOfRooms = 1 } = req.body;

    if (!hotelId || !roomId || !checkIn || !checkOut || !numberOfGuests) {
      return res.status(400).json({ message: 'Hotel, room, check-in, check-out, and guests are required' });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (end <= start) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    const hotelObj = await Hotel.findById(hotelId);
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.availability) {
      return res.status(400).json({ message: 'Selected room is currently unavailable' });
    }

    const roomsCount = Number(numberOfRooms) || 1;
    const maxCapacity = room.capacity * roomsCount;
    if (Number(numberOfGuests) > maxCapacity) {
      return res.status(400).json({
        message: `Guest count (${numberOfGuests}) exceeds room capacity (${maxCapacity} for ${roomsCount} room(s))`,
      });
    }

    const diffTime = Math.abs(end - start);
    const numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const totalAmount = room.pricePerNight * numberOfNights * roomsCount;
    const bookingReference = `WF-HT-${Math.floor(100000 + Math.random() * 900000)}`;

    const booking = await HotelBooking.create({
      user: req.user._id,
      hotel: hotelId,
      room: roomId,
      checkIn: start,
      checkOut: end,
      numberOfGuests: Number(numberOfGuests),
      numberOfRooms: roomsCount,
      numberOfNights,
      totalAmount,
      bookingReference,
      status: 'confirmed',
    });

    const populatedBooking = await HotelBooking.findById(booking._id)
      .populate('hotel', 'name location rating address images')
      .populate('room', 'roomType pricePerNight capacity amenities')
      .populate('user', 'firstName lastName email phone');

    // Trigger Email Notification
    sendBookingConfirmationEmail({
      userEmail: req.user.email,
      userName: `${req.user.firstName} ${req.user.lastName}`,
      bookingReference,
      title: hotelObj ? hotelObj.name : 'Hotel Stay',
      type: `${room.roomType} Suite Hotel Stay`,
      date: `${start.toDateString()} - ${end.toDateString()}`,
      guests: Number(numberOfGuests),
      totalAmount,
    });

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get user's hotel bookings
// @route   GET /api/hotel-bookings/my
// @access  Private
export const getMyHotelBookings = async (req, res) => {
  try {
    const bookings = await HotelBooking.find({ user: req.user._id })
      .populate('hotel', 'name location rating images address')
      .populate('room', 'roomType pricePerNight capacity')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get hotel booking by ID
// @route   GET /api/hotel-bookings/:id
// @access  Private
export const getHotelBookingById = async (req, res) => {
  try {
    const booking = await HotelBooking.findById(req.params.id)
      .populate('hotel')
      .populate('room')
      .populate('user', 'firstName lastName email phone country');

    if (!booking) {
      return res.status(404).json({ message: 'Hotel booking not found' });
    }

    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Cancel hotel booking
// @route   PUT /api/hotel-bookings/:id/cancel
// @access  Private
export const cancelHotelBooking = async (req, res) => {
  try {
    const booking = await HotelBooking.findById(req.params.id);
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

    const updated = await HotelBooking.findById(booking._id)
      .populate('hotel')
      .populate('room')
      .populate('user', 'firstName lastName email');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
