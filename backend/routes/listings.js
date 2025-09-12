const express = require('express');
const { body, validationResult } = require('express-validator');
const Listing = require('../models/Listing');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const listingValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('price').isNumeric().withMessage('Price must be a number').isFloat({ min: 0 }).withMessage('Price must be positive')
];

// Get all listings (public)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const listings = await Listing.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Listing.countDocuments();
    
    res.json({
      listings,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalListings: total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('createdBy', 'name email');
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    res.json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new listing (protected)
router.post('/', protect, listingValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, price } = req.body;

    const listing = await Listing.create({
      title,
      description,
      category,
      price,
      createdBy: req.user.id
    });

    // Populate the createdBy field
    await listing.populate('createdBy', 'name email');

    res.status(201).json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user's listings (protected)
router.get('/user/my-listings', protect, async (req, res) => {
  try {
    const listings = await Listing.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a listing (protected)
router.put('/:id', protect, listingValidation, async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    
    let listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Check if user owns the listing
    if (listing.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { title, description, category, price },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
    
    res.json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a listing (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Check if user owns the listing
    if (listing.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await Listing.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Listing removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
