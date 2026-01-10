import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, User, ArrowRight, ArrowLeft, Phone } from 'lucide-react';
import '../index.css'; // Ensure CSS is imported

const Auth = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    console.log('Auth component rendering, isSignUp:', isSignUp);

    // Login States
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // Signup States
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPhone, setSignupPhone] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupRole, setSignupRole] = useState('farmer');
    const [signupError, setSignupError] = useState('');

    useEffect(() => {
        if (location.pathname === '/signup') {
            setIsSignUp(true);
        } else {
            setIsSignUp(false);
        }
    }, [location.pathname]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://127.0.0.1:5001/api/auth/login', {
                email: loginEmail,
                password: loginPassword,
            });
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('token', data.token);
            navigate('/');
        } catch (err) {
            setLoginError(err.response?.data?.message || 'Login failed');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://127.0.0.1:5001/api/auth/register', {
                name: signupName,
                email: signupEmail,
                phoneNumber: signupPhone,
                password: signupPassword,
                role: signupRole
            });
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('token', data.token);
            navigate('/');
        } catch (err) {
            setSignupError(err.response?.data?.message || 'Signup failed');
        }
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        // Optional: Update URL without reloading
        window.history.pushState(null, '', isSignUp ? '/login' : '/signup');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className={`relative glass rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full min-h-[600px] transition-all duration-300 ${isSignUp ? 'right-panel-active' : ''}`} id="container">

                {/* Sign Up Container */}
                <div className="absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-1/2 opacity-0 sign-up-container">
                    <form onSubmit={handleSignup} className="bg-transparent flex flex-col items-center justify-center h-full px-12 text-center">
                        <h1 className="font-bold text-3xl mb-4 text-primary">Create Account</h1>
                        <div className="social-container mb-4">
                            <span className="text-gray-600 text-sm">Use your email for registration</span>
                        </div>
                        {signupError && <div className="text-red-500 text-sm mb-4">{signupError}</div>}

                        <div className="relative w-full mb-4">
                            <User className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Name"
                                className="bg-white/50 backdrop-blur-sm border-none p-3 pl-10 rounded-lg w-full outline-none focus:ring-2 focus:ring-primary placeholder-gray-500"
                                value={signupName}
                                onChange={(e) => setSignupName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="relative w-full mb-4">
                            <Mail className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                            <input
                                type="email"
                                placeholder="Email"
                                className="bg-white/50 backdrop-blur-sm border-none p-3 pl-10 rounded-lg w-full outline-none focus:ring-2 focus:ring-primary placeholder-gray-500"
                                value={signupEmail}
                                onChange={(e) => setSignupEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="relative w-full mb-4">
                            <Phone className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                className="bg-white/50 backdrop-blur-sm border-none p-3 pl-10 rounded-lg w-full outline-none focus:ring-2 focus:ring-primary placeholder-gray-500"
                                value={signupPhone}
                                onChange={(e) => setSignupPhone(e.target.value)}
                                required
                            />
                        </div>
                        <div className="relative w-full mb-4">
                            <Lock className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                            <input
                                type="password"
                                placeholder="Password"
                                className="bg-white/50 backdrop-blur-sm border-none p-3 pl-10 rounded-lg w-full outline-none focus:ring-2 focus:ring-primary placeholder-gray-500"
                                value={signupPassword}
                                onChange={(e) => setSignupPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="relative w-full mb-6">
                            <select
                                value={signupRole}
                                onChange={(e) => setSignupRole(e.target.value)}
                                className="bg-white/50 backdrop-blur-sm border-none p-3 rounded-lg w-full outline-none focus:ring-2 focus:ring-primary text-gray-600"
                            >
                                <option value="farmer">I am a Farmer</option>
                                <option value="buyer">I am a Buyer</option>
                            </select>
                        </div>

                        <button className="rounded-full border border-primary bg-primary text-white text-xs font-bold py-3 px-12 tracking-wider uppercase transition-transform transform hover:scale-105 active:scale-95 focus:outline-none">
                            Sign Up
                        </button>
                    </form>
                </div>

                {/* Sign In Container */}
                <div className="absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-1/2 sign-in-container">
                    <form onSubmit={handleLogin} className="bg-transparent flex flex-col items-center justify-center h-full px-12 text-center">
                        <h1 className="font-bold text-3xl mb-4 text-primary">Sign in</h1>
                        <div className="social-container mb-4">
                            <span className="text-gray-600 text-sm">Use your account</span>
                        </div>
                        {loginError && <div className="text-red-500 text-sm mb-4">{loginError}</div>}

                        <div className="relative w-full mb-4">
                            <Mail className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                            <input
                                type="email"
                                placeholder="Email"
                                className="bg-white/50 backdrop-blur-sm border-none p-3 pl-10 rounded-lg w-full outline-none focus:ring-2 focus:ring-primary placeholder-gray-500"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="relative w-full mb-6">
                            <Lock className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                            <input
                                type="password"
                                placeholder="Password"
                                className="bg-white/50 backdrop-blur-sm border-none p-3 pl-10 rounded-lg w-full outline-none focus:ring-2 focus:ring-primary placeholder-gray-500"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Link to="#" className="text-sm text-gray-600 hover:text-gray-900 mb-6">Forgot your password?</Link>
                        <button className="rounded-full border border-primary bg-primary text-white text-xs font-bold py-3 px-12 tracking-wider uppercase transition-transform transform hover:scale-105 active:scale-95 focus:outline-none">
                            Sign In
                        </button>
                    </form>
                </div>

                {/* Overlay Container */}
                <div className="absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-600 ease-in-out z-100 overlay-container">
                    <div className="bg-gradient-to-r from-primary/90 to-green-400/90 text-white relative -left-full h-full w-[200%] transform transition-transform duration-600 ease-in-out overlay backdrop-blur-sm">
                        <div className="absolute flex flex-col items-center justify-center h-full w-1/2 text-center top-0 px-10 transform transition-transform duration-600 ease-in-out overlay-left">
                            <h1 className="font-bold text-3xl mb-4">Welcome Back!</h1>
                            <p className="text-sm font-thin leading-5 mb-8">To keep connected with us please login with your personal info</p>
                            <button
                                className="bg-transparent border border-white text-white rounded-full text-xs font-bold py-3 px-12 tracking-wider uppercase transition-transform transform hover:scale-105 active:scale-95 focus:outline-none"
                                onClick={toggleMode}
                            >
                                Sign In
                            </button>
                        </div>
                        <div className="absolute flex flex-col items-center justify-center h-full w-1/2 text-center top-0 px-10 transform transition-transform duration-600 ease-in-out right-0 overlay-right">
                            <h1 className="font-bold text-3xl mb-4">Hello, Friend!</h1>
                            <p className="text-sm font-thin leading-5 mb-8">Enter your personal details and start journey with us</p>
                            <button
                                className="bg-transparent border border-white text-white rounded-full text-xs font-bold py-3 px-12 tracking-wider uppercase transition-transform transform hover:scale-105 active:scale-95 focus:outline-none"
                                onClick={toggleMode}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
