import React, { useState, useEffect } from 'react';
import { Plus, Truck, CheckCircle, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FarmerDashboard = () => {
    const [formData, setFormData] = useState({
        cropName: '',
        quantity: '',
        price: '',
        transport: false
    });
    const [success, setSuccess] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !user.token) {
            alert('Please login to list crops');
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await axios.post('http://localhost:5001/api/marketplace', formData, config);

            setSuccess(true);
            setFormData({
                cropName: '',
                quantity: '',
                price: '',
                transport: false
            });

            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Error creating listing:', error);
            alert('Failed to create listing');
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Farmer Dashboard</h1>
                        <p className="mt-2 text-gray-200">List your produce for buyers</p>
                    </div>
                    <Link to="/marketplace" className="text-green-600 hover:text-green-700 font-medium">
                        Back to Marketplace
                    </Link>
                </div>

                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="bg-green-600 px-6 py-4">
                        <h2 className="text-xl font-semibold text-white flex items-center">
                            <Plus className="h-6 w-6 mr-2" /> Add New Listing
                        </h2>
                    </div>

                    <div className="p-8">
                        {success && (
                            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center animate-fade-in">
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Listing added successfully! Buyers can now see your crop.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Crop Name</label>
                                    <select
                                        name="cropName"
                                        value={formData.cropName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="">Select Crop</option>
                                        <option value="Rice">Rice</option>
                                        <option value="Wheat">Wheat</option>
                                        <option value="Cotton">Cotton</option>
                                        <option value="Sugarcane">Sugarcane</option>
                                        <option value="Potato">Potato</option>
                                        <option value="Onion">Onion</option>
                                        <option value="Tomato">Tomato</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            placeholder="e.g. 100 kg"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pl-10"
                                        />
                                        <Package className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Price</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-gray-500">₹</span>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            placeholder="Total Price"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pl-8"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center pt-6">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="transport"
                                            checked={formData.transport}
                                            onChange={handleChange}
                                            className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                        />
                                        <span className="text-gray-700 font-medium flex items-center">
                                            <Truck className="h-5 w-5 mr-2 text-gray-500" />
                                            Transport Included?
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-green-700 transition transform hover:-translate-y-0.5 shadow-lg"
                                >
                                    List Crop for Sale
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* My Listings Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">My Listings & Bids</h2>
                    <MyListings user={user} success={success} />
                </div>
            </div>
        </div>
    );
};

const MyListings = ({ user, success }) => {
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const fetchListings = async () => {
            if (!user || !user.token) return;

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                const { data } = await axios.get('http://localhost:5001/api/marketplace/my', config);
                setListings(data);
            } catch (error) {
                console.error('Error fetching listings:', error);
            }
        };

        fetchListings();
        // Poll every 5 seconds for updates
        const interval = setInterval(fetchListings, 5000);
        return () => clearInterval(interval);
    }, [user, success]);

    if (listings.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
                You haven't listed any crops yet.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {listings.map(listing => (
                <div key={listing._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{listing.cropName}</h3>
                            <p className="text-sm text-gray-600">{listing.quantity} • ₹{listing.price}</p>
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                            {listing.bids?.length || 0} Bids
                        </span>
                    </div>

                    <div className="p-6">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Received Bids</h4>

                        {listing.bids && listing.bids.length > 0 ? (
                            <div className="space-y-3">
                                {listing.bids.map((bid, index) => (
                                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs mr-3">
                                                {bid.bidder.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{bid.bidder}</p>
                                                <p className="text-xs text-gray-500">{new Date(bid.time).toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-green-600">₹{bid.amount}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No bids received yet.</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FarmerDashboard;
