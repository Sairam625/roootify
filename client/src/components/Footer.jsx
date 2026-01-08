import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-primary text-white pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">About Rootify</h3>
                        <p className="text-green-100 text-sm leading-relaxed mb-4">
                            Rootify is a comprehensive agricultural platform designed to empower farmers with modern solutions. We provide essential services including loan assistance, market trend analysis, and disaster management support.
                        </p>
                        <p className="text-green-100 text-sm leading-relaxed">
                            Our mission is to bridge the gap between traditional farming and modern technology, ensuring sustainable agricultural practices and improved farmer welfare.
                        </p>
                    </div>

                    {/* Connect Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
                        <p className="text-green-100 text-sm mb-4">
                            Follow us on social media for updates, tips, and agricultural insights.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition"><Facebook className="h-5 w-5" /></a>
                            <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition"><Instagram className="h-5 w-5" /></a>
                            <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition"><Linkedin className="h-5 w-5" /></a>
                            <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition"><Youtube className="h-5 w-5" /></a>
                        </div>


                    </div>
                </div>

                <div className="pt-6 text-center text-sm text-green-200">
                    © 2024 Rootify. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
