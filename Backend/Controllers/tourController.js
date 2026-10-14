import Tour from '../Models/Tour.js';
import Destination from '../Models/Destination.js';

// @desc    Get all tours with search, filtering, and pagination
// @route   GET /api/tours
// @access  Public
export const getTours = async (req, res) => {
  try {
    const { destination, category, minPrice, maxPrice, rating, duration, search, page = 1, limit = 50 } = req.query;
    let query = {};

    if (destination) {
      // destination can be an ID or a string matching destinationName/destination name
      if (destination.match(/^[0-9a-fA-F]{24}$/)) {
        query.destination = destination;
      } else {
        const destObj = await Destination.findOne({ name: { $regex: destination, $options: 'i' } });
        if (destObj) {
          query.destination = destObj._id;
        } else {
          query.destinationName = { $regex: destination, $options: 'i' };
        }
      }
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (duration) {
      query.duration = Number(duration);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const count = await Tour.countDocuments(query);
    const tours = await Tour.find(query)
      .populate('destination', 'name country images')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    res.json({
      tours,
      page: Number(page),
      pages: Math.ceil(count / Number(limit)),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get single tour by ID
// @route   GET /api/tours/:id
// @access  Public
export const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).populate('destination', 'name country images description attractions bestTimeToVisit');
    if (!tour) {
      return res.status(404).json({ message: 'Tour package not found' });
    }
    res.json(tour);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Create new tour
// @route   POST /api/tours
// @access  Private/Admin
export const createTour = async (req, res) => {
  try {
    const {
      name,
      destination,
      description,
      images,
      price,
      duration,
      category,
      itinerary,
      includedServices,
      availableDates,
      maxParticipants,
      status,
    } = req.body;

    if (!name || !destination || !description || !price || !duration) {
      return res.status(400).json({ message: 'Name, destination, description, price, and duration are required' });
    }

    const destObj = await Destination.findById(destination);

    const tour = await Tour.create({
      name,
      destination,
      destinationName: destObj ? destObj.name : '',
      description,
      images: images || [],
      price,
      duration,
      category: category || 'Adventure',
      itinerary: itinerary || [],
      includedServices: includedServices || [],
      availableDates: availableDates || [new Date()],
      maxParticipants: maxParticipants || 20,
      status: status || 'active',
    });

    const populatedTour = await Tour.findById(tour._id).populate('destination', 'name country');
    res.status(201).json(populatedTour);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update tour
// @route   PUT /api/tours/:id
// @access  Private/Admin
export const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    const fields = [
      'name',
      'destination',
      'description',
      'images',
      'price',
      'duration',
      'category',
      'itinerary',
      'includedServices',
      'availableDates',
      'maxParticipants',
      'rating',
      'status',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        tour[field] = req.body[field];
      }
    });

    if (req.body.destination) {
      const destObj = await Destination.findById(req.body.destination);
      if (destObj) {
        tour.destinationName = destObj.name;
      }
    }

    const updatedTour = await tour.save();
    const populated = await Tour.findById(updatedTour._id).populate('destination', 'name country');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete tour
// @route   DELETE /api/tours/:id
// @access  Private/Admin
export const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    await Tour.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
