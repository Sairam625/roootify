
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Wheat, User } from 'lucide-react';
import './GoogleTranslate.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    localStorage.removeItem('user');
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };


  useEffect(() => {
    const addGoogleTranslateScript = () => {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            includedLanguages: 'en,hi,bn,te,mr,ta,ur,gu,kn,ml,pa',
            autoDisplay: false,
          },
          'google_translate_element'
        );
      };
    };

    if (!window.google || !window.google.translate) {
      addGoogleTranslateScript();
    }
  }, []);


  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-[1000] transition-all duration-300 ${isScrolled ? 'py-2 bg-primary/90 backdrop-blur-md shadow-lg' : 'bg-primary py-2'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">

        {/* Top Section: Logo Centered, Translate Right */}
        <div className={`relative flex justify-center items-center ${isScrolled ? 'mb-0' : 'mb-1'} transition-all duration-300`}>

          {/* Logo & Tagline */}
          <div
            className={`flex flex-col items-center cursor-pointer transition-all duration-300 overflow-hidden ${isScrolled ? 'h-0 opacity-0' : 'h-auto opacity-100'}`}
            onClick={() => navigate('/')}
          >
            <div className="flex items-center space-x-3">
              <Wheat className="h-10 w-10 text-yellow-400" />
              <span className="text-4xl font-bold tracking-wide">Rootify</span>
            </div>
            <span className="text-sm text-green-200 mt-1 tracking-wider">Grounded Solutions for Farmers</span>
          </div>

          {/* Google Translate (Desktop Absolute Right) */}
          <div className="absolute right-0 top-2 hidden md:block">
            <div id="google_translate_element" className="hover:scale-110 transition transform duration-200"></div>
          </div>

          {/* Mobile Menu Button (Absolute Right) */}
          <div className="absolute right-0 top-4 md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none p-2">
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>

        {/* Bottom Section: Navigation Links Centered (Desktop) */}
        <div className={`hidden md:flex justify-center items-center space-x-10 transition-all duration-300 ${isScrolled ? 'border-t-0 pt-0' : 'border-t border-green-600/30 pt-1'}`}>
          <Link to="/" className="text-lg font-medium hover:text-yellow-400 transition hover:scale-105 transform duration-200">Home</Link>
          <Link to="/loans" className="text-lg font-medium hover:text-yellow-400 transition hover:scale-105 transform duration-200">Loans</Link>
          <Link to="/prices" className="text-lg font-medium hover:text-yellow-400 transition hover:scale-105 transform duration-200">Market Trends</Link>
          <Link to="/marketplace" className="text-lg font-medium hover:text-yellow-400 transition hover:scale-105 transform duration-200">Marketplace</Link>

          <Link to="/queries" className="text-lg font-medium hover:text-yellow-400 transition hover:scale-105 transform duration-200">queries</Link>

          {/* Auth Buttons */}
          <div className="ml-8 pl-8 border-l border-green-600/30 relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center hover:bg-yellow-400 transition duration-200">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="bg-white text-primary px-6 py-2 rounded-full font-bold hover:bg-yellow-400 hover:text-primary transition shadow-md">
                Login/Signup
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-primary pb-6 px-4 border-t border-green-600/30">
          <div className="pt-4 space-y-3 flex flex-col items-center">
            <Link to="/" className="block w-full text-center px-3 py-2 rounded-md hover:bg-green-700 text-lg">Home</Link>
            <Link to="/loans" className="block w-full text-center px-3 py-2 rounded-md hover:bg-green-700 text-lg">Loans</Link>
            <Link to="/prices" className="block w-full text-center px-3 py-2 rounded-md hover:bg-green-700 text-lg">Market Trends</Link>
            <Link to="/marketplace" className="block w-full text-center px-3 py-2 rounded-md hover:bg-green-700 text-lg">Marketplace</Link>

            <Link to="/contact" className="text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium transition-colors">Queries</Link>

            <div className="w-full text-center py-4 border-t border-green-600/30 mt-2 flex flex-col items-center gap-4">
              <div id="google_translate_element" className="bg-green-700 px-3 py-1 rounded-md inline-block"></div>

              {user ? (
                <button onClick={handleLogout} className="w-full max-w-xs bg-white text-primary px-4 py-2 rounded-full font-bold">Logout</button>
              ) : (
                <Link to="/login" className="w-full max-w-xs bg-white text-primary px-4 py-2 rounded-full font-bold">Login/Signup</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

