import Room from '../Models/Room.js';
import Hotel from '../Models/Hotel.js';

// @desc    Get rooms (optional filter by hotel)
// @route   GET /api/rooms
// @access  Public
export const getRooms = async (req, res) => {
  try {
    const { hotel } = req.query;
    let query = {};

    if (hotel) {
      query.hotel = hotel;
    }

    const rooms = await Room.find(query).populate('hotel', 'name location rating').sort({ pricePerNight: 1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Public
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('hotel', 'name location rating images address');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private/Admin
export const createRoom = async (req, res) => {
  try {
    const { hotel, roomType, description, capacity, pricePerNight, amenities, images, availability } = req.body;

    if (!hotel || !roomType || !capacity || !pricePerNight) {
      return res.status(400).json({ message: 'Hotel, roomType, capacity, and pricePerNight are required' });
    }

    const hotelExists = await Hotel.findById(hotel);
    if (!hotelExists) {
      return res.status(404).json({ message: 'Associated hotel not found' });
    }

    const room = await Room.create({
      hotel,
      roomType,
      description: description || '',
      capacity,
      pricePerNight,
      amenities: amenities || [],
      images: images || [],
      availability: availability !== undefined ? availability : true,
    });

    const populated = await Room.findById(room._id).populate('hotel', 'name location');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const fields = ['hotel', 'roomType', 'description', 'capacity', 'pricePerNight', 'amenities', 'images', 'availability'];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        room[field] = req.body[field];
      }
    });

    const updatedRoom = await room.save();
    const populated = await Room.findById(updatedRoom._id).populate('hotel', 'name location');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
