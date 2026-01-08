import React from 'react';
import { TrendingUp, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TrendingCrops = () => {
    const navigate = useNavigate();
    const crops = [
        {
            id: 1,
            name: 'Basmati Rice',
            region: 'North India (Punjab)',
            price: '₹95/kg',
            trend: '+5.2%',
            image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            description: 'High demand in international markets.'
        },
        {
            id: 2,
            name: 'Alphonso Mango',
            region: 'West India (Maharashtra)',
            price: '₹1200/doz',
            trend: '+12%',
            image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            description: 'Peak season approaching, prices soaring.'
        },
        {
            id: 3,
            name: 'Black Pepper',
            region: 'South India (Kerala)',
            price: '₹520/kg',
            trend: '+3.8%',
            image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            description: 'Steady increase due to export demand.'
        },
        {
            id: 4,
            name: 'Jute',
            region: 'East India (West Bengal)',
            price: '₹45/kg',
            trend: '+1.5%',
            image: 'data:image/jpeg;base64,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',
            description: 'Government subsidies boosting production.'
        },
        {
            id: 5,
            name: 'Cotton',
            region: 'Central India (Gujarat)',
            price: '₹62/kg',
            trend: '-0.8%',
            image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=500&auto=format&fit=crop',
            description: 'Slight dip due to surplus supply.'
        },
        {
            id: 6,
            name: 'Tea',
            region: 'North East (Assam)',
            price: '₹280/kg',
            trend: '+4.1%',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNzHcKy2CN_DP3erJ6M4ACC0j4F8GOt4gjdBeQz4BN1ykZLhP4UCsGNgUWH7z2dFW85f0&usqp=CAU',
            description: 'Premium flush fetching record prices.'
        }
    ];

    return (
        <div className="py-12 bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white sm:text-4xl">Trending Crops Across Regions</h2>
                    <p className="mt-4 text-xl text-gray-200">Stay updated with the most profitable crops in your area.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {crops.map((crop) => (
                        <div key={crop.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100 group">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={crop.image}
                                    alt={crop.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                                    <span className={crop.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                                        {crop.trend}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{crop.name}</h3>
                                    <span className="text-lg font-bold text-primary">{crop.price}</span>
                                </div>

                                <div className="flex items-center text-gray-500 mb-4 text-sm">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {crop.region}
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {crop.description}
                                </p>

                                <button
                                    onClick={() => navigate(`/analytics/${crop.id}`)}
                                    className="w-full bg-light text-primary font-semibold py-2 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <TrendingUp className="h-4 w-4" />
                                    View Analytics
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrendingCrops;
