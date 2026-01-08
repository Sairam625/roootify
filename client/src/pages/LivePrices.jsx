import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

const LivePrices = () => {
    // Expanded Mock Data
    const MOCK_PRICES = [
        { id: 1, crop: 'Rice (Basmati)', price: '₹4500/qtl', change: '+1.8%' },
        { id: 2, crop: 'Wheat (Sharbati)', price: '₹3200/qtl', change: '-0.5%' },
        { id: 3, crop: 'Sugarcane', price: '₹380/qtl', change: '+3.2%' },
        { id: 4, crop: 'Cotton (Long Staple)', price: '₹6000/qtl', change: '+2.5%' },
        { id: 5, crop: 'Maize', price: '₹2200/qtl', change: '+1.2%' },
        { id: 6, crop: 'Potato (Jyoti)', price: '₹1800/qtl', change: '-1.0%' },
        { id: 7, crop: 'Tomato (Hybrid)', price: '₹2500/qtl', change: '+4.0%' },
        { id: 8, crop: 'Onion (Nashik)', price: '₹3000/qtl', change: '-2.1%' },
        { id: 9, crop: 'Soybean', price: '₹4800/qtl', change: '+0.8%' },
        { id: 10, crop: 'Mustard', price: '₹5400/qtl', change: '+1.5%' },
        { id: 11, crop: 'Groundnut', price: '₹6200/qtl', change: '-0.3%' },
        { id: 12, crop: 'Turmeric', price: '₹7500/qtl', change: '+2.2%' },
        { id: 13, crop: 'Chilli (Red)', price: '₹12000/qtl', change: '+5.0%' },
        { id: 14, crop: 'Garlic', price: '₹8000/qtl', change: '-1.5%' },
        { id: 15, crop: 'Ginger', price: '₹4500/qtl', change: '+1.0%' },
        { id: 16, crop: 'Moong Dal', price: '₹7800/qtl', change: '+0.5%' },
        { id: 17, crop: 'Chana (Bengal Gram)', price: '₹5100/qtl', change: '-0.8%' },
        { id: 18, crop: 'Bajra', price: '₹2100/qtl', change: '+0.2%' },
        { id: 19, crop: 'Jowar', price: '₹2800/qtl', change: '+1.1%' },
        { id: 20, crop: 'Coconut', price: '₹2500/1000pcs', change: '+0.9%' },
    ];

    const [prices, setPrices] = useState(MOCK_PRICES);
    const [loading, setLoading] = useState(false);

    // In a real app, we would fetch from API, but for now we use the mock data directly
    // to ensure it shows up immediately.
    /*
    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const { data } = await axios.get('http://localhost:5001/api/data/prices');
                setPrices(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching prices:', error);
                setLoading(false);
            }
        };

        fetchPrices();
    }, []);
    */

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-white sm:text-4xl">Live Mandi Prices</h1>
                    <p className="mt-4 text-lg text-gray-200">Real-time market rates from 900+ markets across India</p>
                </div>

                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (per kg)</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change (24h)</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {prices.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{item.crop}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-bold">{item.price}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {item.change.startsWith('+') ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                                {item.change}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button className="text-primary hover:text-green-900 flex items-center">
                                                Sell Now <ArrowUpRight className="h-4 w-4 ml-1" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LivePrices;
