import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, X, CloudLightning, CloudSnow } from 'lucide-react';

const quotes = [
    "The ultimate goal of farming is not the growing of crops, but the cultivation and perfection of human beings.",
    "Agriculture is our wisest pursuit, because it will in the end contribute most to real wealth, good morals, and happiness.",
    "To forget how to dig the earth and to tend the soil is to forget ourselves.",
    "The discovery of agriculture was the first big step toward a civilized life.",
    "Farming looks mighty easy when your plow is a pencil and you're a thousand miles from the corn field."
];

const WeatherCard = () => {
    const [weather, setWeather] = useState(null);
    const [quote, setQuote] = useState('');
    const [greeting, setGreeting] = useState('');
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Set random quote
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

        // Set greeting based on time
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        // Fetch Weather (Defaulting to Nagpur, India - Central location)
        // In a real app, we'd ask for geolocation
        const fetchWeather = async () => {
            try {
                const response = await fetch(
                    'https://api.open-meteo.com/v1/forecast?latitude=21.1458&longitude=79.0882&current_weather=true'
                );
                const data = await response.json();
                setWeather(data.current_weather);
            } catch (error) {
                console.error("Error fetching weather:", error);
            }
        };

        fetchWeather();
    }, []);

    if (!isVisible) return null;

    const getWeatherIcon = (code) => {
        if (code <= 3) return <Sun className="h-6 w-6 text-yellow-400" />;
        if (code <= 48) return <Cloud className="h-6 w-6 text-gray-400" />;
        if (code <= 67) return <CloudRain className="h-6 w-6 text-blue-400" />;
        if (code <= 77) return <CloudSnow className="h-6 w-6 text-white" />;
        if (code <= 82) return <CloudRain className="h-6 w-6 text-blue-500" />;
        if (code <= 99) return <CloudLightning className="h-6 w-6 text-purple-500" />;
        return <Sun className="h-6 w-6 text-yellow-400" />;
    };

    return (
        <div className="fixed bottom-4 right-4 z-40 w-72 animate-fade-in-up">
            <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-lg shadow-xl overflow-hidden border border-green-700/50 backdrop-blur-sm">
                <div className="p-3 relative">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-2 right-2 text-green-300 hover:text-white transition"
                    >
                        <X className="h-3 w-3" />
                    </button>

                    <div className="flex items-start space-x-3">
                        <div className="bg-white/10 p-2 rounded-full">
                            {weather ? getWeatherIcon(weather.weathercode) : <Sun className="h-6 w-6 animate-pulse text-yellow-400" />}
                        </div>

                        <div className="flex-1">
                            <h3 className="text-base font-bold text-white mb-0.5">{greeting}, Farmer!</h3>

                            {weather && (
                                <div className="flex items-center space-x-2 text-green-200 mb-2">
                                    <span className="text-xl font-bold text-white">{weather.temperature}°C</span>
                                    <span className="text-xs flex items-center">
                                        <Wind className="h-3 w-3 mr-1" /> {weather.windspeed} km/h
                                    </span>
                                </div>
                            )}

                            <div className="bg-black/20 p-2 rounded-md">
                                <p className="text-xs text-green-100 italic leading-tight">"{quote}"</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;
