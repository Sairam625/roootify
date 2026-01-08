import React, { useState, useEffect } from 'react';
import { ShoppingCart, Truck, User, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BuyerDashboard = () => {
    const [listings, setListings] = useState([]);
    const [bidAmount, setBidAmount] = useState({});
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    useEffect(() => {
        const fetchListings = async () => {
            if (!user || !user.token) return;

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                const { data } = await axios.get('http://localhost:5001/api/marketplace', config);
                setListings(data);
            } catch (error) {
                console.error('Error fetching listings:', error);
            }
        };

        fetchListings();
        // Poll every 5 seconds for updates
        const interval = setInterval(fetchListings, 5000);
        return () => clearInterval(interval);
    }, [user]);

    const handleBidChange = (id, value) => {
        setBidAmount(prev => ({ ...prev, [id]: value }));
    };

    const handlePlaceBid = async (id) => {
        const amount = bidAmount[id];
        if (!amount) return;

        if (!user || !user.token) {
            alert('Please login to place a bid');
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await axios.post(`http://localhost:5001/api/marketplace/${id}/bid`, { amount }, config);

            alert(`Bid of ₹${amount} placed successfully! The farmer will be notified.`);
            setBidAmount(prev => ({ ...prev, [id]: '' }));

            // Refresh listings to show new bid count immediately (optional, as polling will catch it)
            const { data } = await axios.get('http://localhost:5001/api/marketplace', config);
            setListings(data);

        } catch (error) {
            console.error('Error placing bid:', error);
            alert('Failed to place bid');
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Buyer Dashboard</h1>
                        <p className="mt-2 text-gray-200">Browse and bid on fresh produce directly from farmers</p>
                    </div>
                    <Link to="/marketplace" className="text-blue-600 hover:text-blue-700 font-medium">
                        Back to Marketplace
                    </Link>
                </div>

                {listings.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                        <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900">No listings available yet</h3>
                        <p className="text-gray-500 mt-2">Check back later or ask farmers to list their crops!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {listings.map((item) => (
                            <div key={item._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 border border-gray-100">
                                <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-white">{item.cropName}</h3>
                                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full border border-blue-400">
                                        Active
                                    </span>
                                </div>

                                <div className="p-6">
                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-center text-gray-700">
                                            <User className="h-5 w-5 text-gray-400 mr-3" />
                                            <span className="font-medium">{item.farmerName}</span>
                                        </div>
                                        <div className="flex items-center text-gray-700">
                                            <Tag className="h-5 w-5 text-gray-400 mr-3" />
                                            <span>Quantity: <span className="font-bold">{item.quantity}</span></span>
                                        </div>
                                        <div className="flex items-center text-gray-700">
                                            <span className="h-5 w-5 flex items-center justify-center text-gray-400 mr-3 font-bold">₹</span>
                                            <span>Ask Price: <span className="font-bold text-green-600">₹{item.price}</span></span>
                                        </div>
                                        <div className="flex items-center text-gray-700">
                                            <Truck className={`h-5 w-5 mr-3 ${item.transport ? 'text-green-500' : 'text-red-400'}`} />
                                            <span>Transport: {item.transport ? <span className="text-green-600 font-medium">Included</span> : <span className="text-red-500">Not Included</span>}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Place your bid</label>
                                        <div className="flex space-x-2">
                                            <input
                                                type="number"
                                                placeholder="Amount (₹)"
                                                value={bidAmount[item._id] || ''}
                                                onChange={(e) => handleBidChange(item._id, e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            />
                                            <button
                                                onClick={() => handlePlaceBid(item._id)}
                                                disabled={!bidAmount[item._id]}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                            >
                                                Bid
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuyerDashboard;
