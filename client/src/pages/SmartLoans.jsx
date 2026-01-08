import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';

const SmartLoans = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedState, setSelectedState] = useState('All');
    const [selectedCrop, setSelectedCrop] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const { data } = await axios.get('http://localhost:5001/api/data/loans');
                setLoans(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching loans:', error);
                setLoading(false);
            }
        };

        fetchLoans();
    }, []);

    const filteredLoans = loans.filter(loan => {
        const stateMatch = selectedState === 'All' || loan.state === selectedState || loan.state === 'All India';
        const cropMatch = selectedCrop === 'All' || loan.crop === selectedCrop || loan.crop === 'All';
        const searchMatch = loan.title.toLowerCase().includes(searchQuery.toLowerCase());
        return stateMatch && cropMatch && searchMatch;
    }).sort((a, b) => {
        // Prioritize exact state match
        if (a.state === selectedState && b.state !== selectedState) return -1;
        if (a.state !== selectedState && b.state === selectedState) return 1;
        // Then prioritize exact crop match if a crop is selected
        if (selectedCrop !== 'All') {
            if (a.crop === selectedCrop && b.crop !== selectedCrop) return -1;
            if (a.crop !== selectedCrop && b.crop === selectedCrop) return 1;
        }
        return 0;
    });

    const states = [
        'All',
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
        'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
        'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
        'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
        'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
        'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh',
        'Lakshadweep', 'Puducherry'
    ];

    const crops = [
        'All', 'Rice', 'Wheat', 'Sugarcane', 'Cotton', 'Maize', 'Millets', 'Pulses',
        'Oilseeds', 'Fruits', 'Vegetables', 'Horticulture', 'Oil Palm', 'Coconut', 'Spices'
    ];

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-white sm:text-4xl">Smart Loans & Subsidies</h1>
                    <p className="mt-4 text-lg text-gray-200">AI-matched loans and government subsidies tailored for you</p>
                </div>

                {/* Search and Filters */}
                <div className="max-w-3xl mx-auto mb-8 space-y-4">
                    {/* Search Bar */}
                    <div>
                        <label htmlFor="search-loan" className="block text-sm font-medium text-white mb-2">Search Loans</label>
                        <input
                            type="text"
                            id="search-loan"
                            className="block w-full pl-4 pr-4 py-2 text-base text-gray-900 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm rounded-md shadow-sm"
                            placeholder="Search by loan name (e.g., KCC, PM-KISAN)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="state-filter" className="block text-sm font-medium text-white mb-2">Filter by State</label>
                            <select
                                id="state-filter"
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                                className="block w-full pl-3 pr-10 py-2 text-base text-gray-900 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm rounded-md shadow-sm"
                            >
                                {states.map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="crop-filter" className="block text-sm font-medium text-white mb-2">Filter by Crop</label>
                            <select
                                id="crop-filter"
                                value={selectedCrop}
                                onChange={(e) => setSelectedCrop(e.target.value)}
                                className="block w-full pl-3 pr-10 py-2 text-base text-gray-900 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm rounded-md shadow-sm"
                            >
                                {crops.map((crop) => (
                                    <option key={crop} value={crop}>{crop}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredLoans.map((loan) => (
                            <div key={loan.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition border border-gray-100">
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">{loan.title}</h3>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {loan.state}
                                            </span>
                                            {loan.crop && loan.crop !== 'All' && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    {loan.crop}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-2 max-w-xl text-sm text-gray-500">
                                        <p>Interest Rate: <span className="font-semibold text-primary">{loan.interest}</span></p>
                                        <p>Amount: <span className="font-semibold text-gray-700">{loan.amount}</span></p>
                                    </div>
                                    <div className="mt-5">
                                        <Link to={`/loans/${loan.id}/apply`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full justify-center">
                                            Apply Now
                                        </Link>
                                    </div>
                                    <div className="mt-4 flex items-center text-xs text-green-600">
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        <span>Simple application process</span>
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

export default SmartLoans;
