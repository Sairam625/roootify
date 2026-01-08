const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const { protect } = require('../middleware/authMiddleware');

// @desc    Create a new listing
// @route   POST /api/marketplace
// @access  Private (Farmer)
router.post('/', protect, async (req, res) => {
    try {
        const { cropName, quantity, price, transport } = req.body;

        const listing = await Listing.create({
            farmer: req.user._id,
            farmerName: req.user.name,
            cropName,
            quantity,
            price,
            transport
        });

        res.status(201).json(listing);
    } catch (error) {
        console.error('Create Listing Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get all listings
// @route   GET /api/marketplace
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const listings = await Listing.find().sort({ createdAt: -1 });
        res.json(listings);
    } catch (error) {
        console.error('Get Listings Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get my listings
// @route   GET /api/marketplace/my
// @access  Private (Farmer)
router.get('/my', protect, async (req, res) => {
    try {
        const listings = await Listing.find({ farmer: req.user._id }).sort({ createdAt: -1 });
        res.json(listings);
    } catch (error) {
        console.error('Get My Listings Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Place a bid
// @route   POST /api/marketplace/:id/bid
// @access  Private (Buyer)
router.post('/:id/bid', protect, async (req, res) => {
    try {
        const { amount } = req.body;
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        const newBid = {
            bidder: req.user.name,
            amount,
            time: Date.now()
        };

        listing.bids.push(newBid);
        await listing.save();

        res.json(listing);
    } catch (error) {
        console.error('Place Bid Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
