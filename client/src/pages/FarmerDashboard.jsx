import React, { useState, useEffect } from 'react';
import { Plus, Truck, CheckCircle, Package, MessageCircle, X, Check, Send } from 'lucide-react';
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
        console.log('[DEBUG] Form submitted', formData);

        if (!user || !user.token) {
            console.log('[DEBUG] No user/token');
            alert('Please login to list crops');
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            console.log('[DEBUG] Sending request to http://localhost:5001/api/marketplace');

            const response = await axios.post('http://127.0.0.1:5001/api/marketplace', formData, config);
            console.log('[DEBUG] Response received', response.data);

            setSuccess(true);
            setFormData({
                cropName: '',
                quantity: '',
                price: '',
                transport: false
            });

            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('[DEBUG] Error creating listing:', error);
            if (error.response) {
                console.error('[DEBUG] Response data:', error.response.data);
                console.error('[DEBUG] Response status:', error.response.status);
            }
            alert('Failed to create listing');
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Farmer Dashboard</h1>
                        <p className="mt-2 text-gray-200">List your produce for buyers</p>
                    </div>
                    <Link to="/marketplace" className="text-green-600 hover:text-green-700 font-medium bg-white px-4 py-2 rounded-lg shadow">
                        Back to Marketplace
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Add Listing */}
                    <div>
                        <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-12 lg:mb-0">
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
                                    <div className="grid grid-cols-1 gap-6">
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

                                        <div className="flex items-center pt-2">
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
                    </div>

                    {/* Right Column: My Listings */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 bg-white/80 inline-block px-4 py-2 rounded-lg backdrop-blur-sm">My Listings & Bids</h2>
                        <div className="h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            <MyListings user={user} success={success} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MyListings = ({ user, success }) => {
    const [listings, setListings] = useState([]);
    const [activeChat, setActiveChat] = useState(null); // { listingId, bidId }

    const fetchListings = async () => {
        if (!user || !user.token) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get('http://127.0.0.1:5001/api/marketplace/my', config);
            setListings(data);
        } catch (error) {
            console.error('Error fetching listings:', error);
        }
    };

    useEffect(() => {
        fetchListings();
        const interval = setInterval(fetchListings, 5000);
        return () => clearInterval(interval);
    }, [user, success]);

    const handleUpdateStatus = async (listingId, bidId, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://127.0.0.1:5001/api/marketplace/${listingId}/bid/${bidId}/status`, { status }, config);
            fetchListings();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

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
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Received Bids</h4>

                        {listing.bids && listing.bids.length > 0 ? (
                            <div className="space-y-4">
                                {listing.bids.map((bid, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-green-200 transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm mr-3">
                                                    {bid.bidder.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{bid.bidder}</p>
                                                    <p className="text-xs text-gray-500">{new Date(bid.time).toLocaleTimeString()} • {new Date(bid.time).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-green-600">₹{bid.amount}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                    bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {bid.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-end space-x-3 border-t border-gray-100 pt-3">
                                            <button
                                                onClick={() => setActiveChat(activeChat?.bidId === bid._id ? null : { listingId: listing._id, bidId: bid._id, messages: bid.messages })}
                                                className="text-gray-600 hover:text-green-600 text-sm font-medium flex items-center"
                                            >
                                                <MessageCircle className="h-4 w-4 mr-1" />
                                                {activeChat?.bidId === bid._id ? 'Close Chat' : 'Negotiate'}
                                            </button>

                                            {bid.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStatus(listing._id, bid._id, 'rejected')}
                                                        className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
                                                    >
                                                        <X className="h-4 w-4 mr-1" /> Reject
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(listing._id, bid._id, 'accepted')}
                                                        className="bg-green-600 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-green-700 flex items-center shadow-sm"
                                                    >
                                                        <Check className="h-4 w-4 mr-1" /> Accept
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                        {/* Chat Area */}
                                        {activeChat?.bidId === bid._id && (
                                            <ChatBox
                                                listingId={listing._id}
                                                bidId={bid._id}
                                                initialMessages={bid.messages || []}
                                                currentUser={user}
                                                onMessageSent={fetchListings}
                                            />
                                        )}
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

const ChatBox = ({ listingId, bidId, initialMessages, currentUser, onMessageSent }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(initialMessages);

    // Sync messages from props if they change (e.g. via polling)
    useEffect(() => {
        setMessages(initialMessages);
    }, [initialMessages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
            await axios.post(`http://127.0.0.1:5001/api/marketplace/${listingId}/bid/${bidId}/message`, { text: message }, config);

            setMessage('');
            onMessageSent(); // Trigger refresh
        } catch (error) {
            console.error('Error sending message:', error);
            alert(error.response?.data?.message || 'Failed to send message');
        }
    };

    return (
        <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="h-40 overflow-y-auto mb-4 space-y-2 pr-2">
                {messages.length > 0 ? (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === currentUser.name ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${msg.sender === currentUser.name
                                ? 'bg-green-600 text-white rounded-br-none'
                                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                                }`}>
                                <p className="font-bold text-xs opacity-75 mb-1">{msg.sender}</p>
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-xs text-gray-400 mt-10">Starting negotiation. Say hello!</p>
                )}
            </div>
            <form onSubmit={handleSend} className="flex gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <button type="submit" className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700">
                    <Send className="h-4 w-4" />
                </button>
            </form>
        </div>
    );
};

export default FarmerDashboard;
