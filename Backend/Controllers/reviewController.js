import Review from '../Models/Review.js';

// @desc    Get reviews (filter by targetType and targetId)
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req, res) => {
  try {
    const { targetType, targetId } = req.query;
    let query = { status: 'approved' };

    if (targetType) query.targetType = targetType;
    if (targetId) query.targetId = targetId;

    const reviews = await Review.find(query)
      .populate('user', 'firstName lastName profileImage')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { targetType, targetId, rating, comment } = req.body;

    if (!targetType || !targetId || !rating || !comment) {
      return res.status(400).json({ message: 'Target type, target ID, rating, and comment are required' });
    }

    const review = await Review.create({
      user: req.user._id,
      targetType,
      targetId,
      rating: Number(rating),
      comment,
      status: 'approved',
    });

    const populated = await Review.findById(review._id).populate('user', 'firstName lastName profileImage');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this review' });
    }

    review.rating = req.body.rating !== undefined ? Number(req.body.rating) : review.rating;
    review.comment = req.body.comment !== undefined ? req.body.comment : review.comment;
    if (req.user.role === 'admin' && req.body.status) {
      review.status = req.body.status;
    }

    const updated = await review.save();
    const populated = await Review.findById(updated._id).populate('user', 'firstName lastName profileImage');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
