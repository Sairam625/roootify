import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Marketplace = () => {
    const navigate = useNavigate();

    useEffect(() => {
        let user = null;
        try {
            user = JSON.parse(localStorage.getItem('user'));
        } catch (error) {
            console.error('Error parsing user:', error);
            localStorage.removeItem('user');
        }

        if (!user) {
            // Not logged in, redirect to login
            navigate('/login');
        } else {
            // Logged in, redirect based on role
            if (user.role === 'farmer') {
                navigate('/marketplace/farmer');
            } else if (user.role === 'buyer') {
                navigate('/marketplace/buyer');
            } else {
                // Fallback if role is missing or unknown
                navigate('/');
            }
        }
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Redirecting to your dashboard...</h2>
                <div className="mt-4 animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            </div>
        </div>
    );
};

export default Marketplace;
