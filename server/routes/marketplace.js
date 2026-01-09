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
            bidderId: req.user._id,
            amount,
            status: 'pending',
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

// @desc    Update bid status (Accept/Reject)
// @route   PUT /api/marketplace/:id/bid/:bidId/status
// @access  Private (Farmer)
router.put('/:id/bid/:bidId/status', protect, async (req, res) => {
    try {
        const { status } = req.body; // 'accepted' or 'rejected'
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Verify that the logged-in user is the owner of the listing
        if (listing.farmer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const bid = listing.bids.id(req.params.bidId);
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }

        bid.status = status;
        await listing.save();

        res.json(listing);
    } catch (error) {
        console.error('Update Bid Status Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Add a message to negotiation chat
// @route   POST /api/marketplace/:id/bid/:bidId/message
// @access  Private (Farmer or Buyer)
router.post('/:id/bid/:bidId/message', protect, async (req, res) => {
    try {
        const { text } = req.body;
        console.log(`[DEBUG] Adding message to listing ${req.params.id}, bid ${req.params.bidId} by user ${req.user._id} (${req.user.name})`);

        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            console.log('[DEBUG] Listing not found');
            return res.status(404).json({ message: 'Listing not found' });
        }

        const bid = listing.bids.id(req.params.bidId);
        if (!bid) {
            console.log('[DEBUG] Bid not found');
            return res.status(404).json({ message: 'Bid not found' });
        }

        const farmerId = listing.farmer.toString();
        const bidderId = bid.bidderId ? bid.bidderId.toString() : null;
        const userId = req.user._id.toString();

        console.log(`[DEBUG] Farmer: ${farmerId}, Bidder: ${bidderId}, CurrentUser: ${userId}`);

        // Ensure user is part of the transaction
        if (farmerId !== userId && bidderId !== userId) {
            console.log('[DEBUG] Authorization Failed');
            return res.status(401).json({ message: 'Not authorized' });
        }

        const newMessage = {
            sender: req.user.name,
            text,
            time: Date.now()
        };

        bid.messages.push(newMessage);
        await listing.save();

        console.log('[DEBUG] Message added successfully');
        res.json(listing);
    } catch (error) {
        console.error('Add Message Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Get my bids (Buyer)
// @route   GET /api/marketplace/my-bids
// @access  Private (Buyer)
router.get('/my-bids', protect, async (req, res) => {
    try {
        // Find listings where bids.bidderId matches req.user._id
        const listings = await Listing.find({ 'bids.bidderId': req.user._id }).sort({ createdAt: -1 });
        res.json(listings);
    } catch (error) {
        console.error('Get My Bids Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get contact info (Phone Number) if bid accepted
// @route   GET /api/marketplace/:id/bid/:bidId/contact
// @access  Private
router.get('/:id/bid/:bidId/contact', protect, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate('farmer', 'phoneNumber');

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        const bid = listing.bids.id(req.params.bidId);
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }

        // Only allow if status is accepted
        if (bid.status !== 'accepted') {
            return res.status(400).json({ message: 'Bid not accepted yet' });
        }

        // Allow Buyer to see Farmer's phone
        if (bid.bidderId.toString() === req.user._id.toString()) {
            return res.json({ phoneNumber: listing.farmer.phoneNumber });
        }

        // Allow Farmer to see Buyer's phone (optional, but good for symmetry)
        // Note: For this to work, we'd need to populate bidderId from User model, but we stored name/id in schema. 
        // Let's stick to Buyer requests Farmer as per requirement.

        return res.status(401).json({ message: 'Not authorized' });

    } catch (error) {
        console.error('Get Contact Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
