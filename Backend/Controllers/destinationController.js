import Destination from '../Models/Destination.js';

// @desc    Get all destinations with search & pagination
// @route   GET /api/destinations
// @access  Public
export const getDestinations = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 50 } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const count = await Destination.countDocuments(query);
    const destinations = await Destination.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    res.json({
      destinations,
      page: Number(page),
      pages: Math.ceil(count / Number(limit)),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get single destination by ID
// @route   GET /api/destinations/:id
// @access  Public
export const getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.json(destination);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Create new destination
// @route   POST /api/destinations
// @access  Private/Admin
export const createDestination = async (req, res) => {
  try {
    const { name, country, description, images, attractions, bestTimeToVisit, featured } = req.body;

    if (!name || !country || !description) {
      return res.status(400).json({ message: 'Name, country, and description are required' });
    }

    const destinationExists = await Destination.findOne({ name });
    if (destinationExists) {
      return res.status(400).json({ message: 'Destination already exists' });
    }

    const destination = await Destination.create({
      name,
      country,
      description,
      images: images || [],
      attractions: attractions || [],
      bestTimeToVisit: bestTimeToVisit || 'Year-round',
      featured: featured !== undefined ? featured : true,
    });

    res.status(201).json(destination);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update destination
// @route   PUT /api/destinations/:id
// @access  Private/Admin
export const updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    const { name, country, description, images, attractions, bestTimeToVisit, featured } = req.body;

    destination.name = name || destination.name;
    destination.country = country || destination.country;
    destination.description = description || destination.description;
    destination.images = images !== undefined ? images : destination.images;
    destination.attractions = attractions !== undefined ? attractions : destination.attractions;
    destination.bestTimeToVisit = bestTimeToVisit || destination.bestTimeToVisit;
    destination.featured = featured !== undefined ? featured : destination.featured;

    const updatedDestination = await destination.save();
    res.json(updatedDestination);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
export const deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    await Destination.findByIdAndDelete(req.params.id);
    res.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
