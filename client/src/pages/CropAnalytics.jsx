import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Leaf, HeartPulse, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CropAnalytics = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Mock Data for all crops
    const cropsData = {
        1: {
            name: 'Basmati Rice',
            image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            description: 'Premium long-grain rice known for its aroma and flavor. High demand in international markets.',
            regions: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Uttarakhand'],
            nutrients: [
                'Carbohydrates: 77.24g',
                'Protein: 7.13g',
                'Fiber: 1.3g',
                'Iron: 4%'
            ],
            benefits: [
                'Gluten-free',
                'Low in fat',
                'Good source of energy',
                'Contains essential amino acids'
            ],
            priceHistory: [
                { year: '2019', price: 3500, state: 'Punjab' },
                { year: '2020', price: 3800, state: 'Punjab' },
                { year: '2021', price: 3600, state: 'Punjab' },
                { year: '2022', price: 4200, state: 'Punjab' },
                { year: '2023', price: 4500, state: 'Punjab' },
                { year: '2024', price: 4800, state: 'Punjab' },
            ]
        },
        2: {
            name: 'Alphonso Mango',
            image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            description: 'Known as the King of Mangoes, famous for its rich taste and texture.',
            regions: ['Maharashtra (Ratnagiri)', 'Gujarat', 'Karnataka'],
            nutrients: [
                'Vitamin C: 60%',
                'Vitamin A: 21%',
                'Fiber: 1.6g',
                'Sugar: 14g'
            ],
            benefits: [
                'Boosts immunity',
                'Improves digestion',
                'Promotes eye health',
                'High in antioxidants'
            ],
            priceHistory: [
                { year: '2019', price: 800, state: 'Maharashtra' },
                { year: '2020', price: 950, state: 'Maharashtra' },
                { year: '2021', price: 1100, state: 'Maharashtra' },
                { year: '2022', price: 1000, state: 'Maharashtra' },
                { year: '2023', price: 1200, state: 'Maharashtra' },
                { year: '2024', price: 1350, state: 'Maharashtra' },
            ]
        },
        3: {
            name: 'Black Pepper',
            image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            description: 'The "King of Spices", widely used for seasoning and medicinal purposes.',
            regions: ['Kerala', 'Karnataka', 'Tamil Nadu'],
            nutrients: [
                'Manganese: 13%',
                'Vitamin K: 9%',
                'Iron: 3%',
                'Fiber: 1.7g'
            ],
            benefits: [
                'High in antioxidants',
                'Anti-inflammatory properties',
                'Benefits your brain',
                'Improves blood sugar control'
            ],
            priceHistory: [
                { year: '2019', price: 320, state: 'Kerala' },
                { year: '2020', price: 340, state: 'Kerala' },
                { year: '2021', price: 380, state: 'Kerala' },
                { year: '2022', price: 450, state: 'Kerala' },
                { year: '2023', price: 500, state: 'Kerala' },
                { year: '2024', price: 520, state: 'Kerala' },
            ]
        },
        4: {
            name: 'Jute',
            image: 'data:image/jpeg;base64,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',
            description: 'The "Golden Fiber", primarily used for making sacks, mats, and ropes.',
            regions: ['West Bengal', 'Bihar', 'Assam'],
            nutrients: [
                'N/A (Primarily a fiber crop)',
                'Leaves are edible and rich in vitamins'
            ],
            benefits: [
                'Eco-friendly and biodegradable',
                'High tensile strength',
                'Low water footprint',
                'Versatile usage'
            ],
            priceHistory: [
                { year: '2019', price: 35, state: 'West Bengal' },
                { year: '2020', price: 38, state: 'West Bengal' },
                { year: '2021', price: 42, state: 'West Bengal' },
                { year: '2022', price: 40, state: 'West Bengal' },
                { year: '2023', price: 45, state: 'West Bengal' },
                { year: '2024', price: 48, state: 'West Bengal' },
            ]
        },
        5: {
            name: 'Cotton',
            image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=500&auto=format&fit=crop',
            description: 'The most important natural fiber crop, essential for the textile industry.',
            regions: ['Gujarat', 'Maharashtra', 'Telangana', 'Punjab'],
            nutrients: [
                'N/A (Fiber crop)',
                'Cottonseed oil is edible'
            ],
            benefits: [
                'Soft and breathable fabric',
                'Hypoallergenic',
                'Durable',
                'Biodegradable'
            ],
            priceHistory: [
                { year: '2019', price: 50, state: 'Gujarat' },
                { year: '2020', price: 52, state: 'Gujarat' },
                { year: '2021', price: 58, state: 'Gujarat' },
                { year: '2022', price: 65, state: 'Gujarat' },
                { year: '2023', price: 60, state: 'Gujarat' },
                { year: '2024', price: 62, state: 'Gujarat' },
            ]
        },
        6: {
            name: 'Tea',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNzHcKy2CN_DP3erJ6M4ACC0j4F8GOt4gjdBeQz4BN1ykZLhP4UCsGNgUWH7z2dFW85f0&usqp=CAU',
            description: 'Aromatic beverage prepared from cured leaves. India is one of the largest producers.',
            regions: ['Assam', 'West Bengal (Darjeeling)', 'Tamil Nadu (Nilgiris)'],
            nutrients: [
                'Antioxidants (Flavonoids)',
                'Caffeine',
                'Potassium',
                'Magnesium'
            ],
            benefits: [
                'Boosts heart health',
                'Improves focus',
                'Reduces risk of stroke',
                'Aids weight loss'
            ],
            priceHistory: [
                { year: '2019', price: 200, state: 'Assam' },
                { year: '2020', price: 220, state: 'Assam' },
                { year: '2021', price: 240, state: 'Assam' },
                { year: '2022', price: 260, state: 'Assam' },
                { year: '2023', price: 275, state: 'Assam' },
                { year: '2024', price: 280, state: 'Assam' },
            ]
        }
    };

    const crop = cropsData[id];

    if (!crop) {
        return <div className="text-center text-white py-20 text-2xl">Crop not found</div>;
    }

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-white mb-8 hover:text-green-400 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Home
                </button>

                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="md:flex">
                        <div className="md:w-1/3 h-64 md:h-auto relative">
                            <img
                                src={crop.image}
                                alt={crop.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
                            <h1 className="absolute bottom-4 left-4 text-3xl font-bold text-white md:hidden">{crop.name}</h1>
                        </div>
                        <div className="p-8 md:w-2/3">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4 hidden md:block">{crop.name}</h1>
                            <p className="text-lg text-gray-600 mb-6">{crop.description}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex items-start">
                                    <MapPin className="h-6 w-6 text-primary mt-1 mr-3" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Major Growing Regions</h3>
                                        <ul className="list-disc list-inside text-gray-600 mt-1">
                                            {crop.regions.map((region, index) => (
                                                <li key={index}>{region}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <TrendingUp className="h-6 w-6 text-primary mt-1 mr-3" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Current Market Status</h3>
                                        <p className="text-gray-600 mt-1">
                                            High demand in {crop.priceHistory[crop.priceHistory.length - 1].state}.
                                            <br />
                                            Latest Price: ₹{crop.priceHistory[crop.priceHistory.length - 1].price}/qtl
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analytics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Price Chart */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <TrendingUp className="h-6 w-6 text-primary mr-2" />
                            Price Trend Analysis (Year-wise)
                        </h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={crop.priceHistory}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="year" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="price" stroke="#16a34a" strokeWidth={3} activeDot={{ r: 8 }} name="Price (₹/qtl)" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-sm text-gray-500 mt-4 text-center">
                            * Prices shown are average annual wholesale prices in major mandis of {crop.priceHistory[0].state}.
                        </p>
                    </div>

                    {/* Info Cards */}
                    <div className="space-y-8">
                        {/* Nutrients */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <Leaf className="h-5 w-5 text-primary mr-2" />
                                Nutritional Value
                            </h2>
                            <ul className="space-y-3">
                                {crop.nutrients.map((item, index) => (
                                    <li key={index} className="flex items-center text-gray-700 bg-green-50 p-3 rounded-lg">
                                        <div className="h-2 w-2 bg-primary rounded-full mr-3"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Benefits */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <HeartPulse className="h-5 w-5 text-red-500 mr-2" />
                                Key Benefits
                            </h2>
                            <ul className="space-y-3">
                                {crop.benefits.map((item, index) => (
                                    <li key={index} className="flex items-center text-gray-700 bg-red-50 p-3 rounded-lg">
                                        <div className="h-2 w-2 bg-red-500 rounded-full mr-3"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CropAnalytics;
