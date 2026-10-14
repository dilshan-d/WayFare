import Hotel from '../Models/Hotel.js';
import Destination from '../Models/Destination.js';

// @desc    Get all hotels with search & filtering
// @route   GET /api/hotels
// @access  Public
export const getHotels = async (req, res) => {
  try {
    const { destination, location, minPrice, rating, amenities, search, page = 1, limit = 50 } = req.query;
    let query = {};

    if (destination) {
      if (destination.match(/^[0-9a-fA-F]{24}$/)) {
        query.destination = destination;
      } else {
        const destObj = await Destination.findOne({ name: { $regex: destination, $options: 'i' } });
        if (destObj) {
          query.destination = destObj._id;
        } else {
          query.location = { $regex: destination, $options: 'i' };
        }
      }
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (minPrice) {
      query.startingPrice = { $gte: Number(minPrice) };
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (amenities) {
      const amenitiesList = Array.isArray(amenities) ? amenities : amenities.split(',');
      query.amenities = { $in: amenitiesList };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const count = await Hotel.countDocuments(query);
    const hotels = await Hotel.find(query)
      .populate('destination', 'name country images')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    res.json({
      hotels,
      page: Number(page),
      pages: Math.ceil(count / Number(limit)),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get single hotel by ID
// @route   GET /api/hotels/:id
// @access  Public
export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate('destination', 'name country images description');
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Create new hotel
// @route   POST /api/hotels
// @access  Private/Admin
export const createHotel = async (req, res) => {
  try {
    const { name, destination, location, address, description, images, rating, startingPrice, amenities, status } = req.body;

    if (!name || !destination || !location) {
      return res.status(400).json({ message: 'Name, destination, and location are required' });
    }

    const hotel = await Hotel.create({
      name,
      destination,
      location,
      address: address || '',
      description: description || '',
      images: images || [],
      rating: rating || 4.5,
      startingPrice: startingPrice || 100,
      amenities: amenities || [],
      status: status || 'active',
    });

    const populated = await Hotel.findById(hotel._id).populate('destination', 'name country');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
export const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const fields = ['name', 'destination', 'location', 'address', 'description', 'images', 'rating', 'startingPrice', 'amenities', 'status'];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        hotel[field] = req.body[field];
      }
    });

    const updatedHotel = await hotel.save();
    const populated = await Hotel.findById(updatedHotel._id).populate('destination', 'name country');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    await Hotel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
