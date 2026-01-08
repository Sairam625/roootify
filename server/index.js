const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');
const marketplaceRoutes = require('./routes/marketplace');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/marketplace', marketplaceRoutes);

app.get('/', (req, res) => {
    res.send('Rootify API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
