import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ExternalLink, CheckCircle, FileText, AlertCircle } from 'lucide-react';

const LoanApplication = () => {
    const { id } = useParams();
    const [loan, setLoan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLoanDetails = async () => {
            try {
                // In a real app, we would have a specific endpoint for this.
                // For now, we fetch all and find the one we need.
                const { data } = await axios.get('http://localhost:5001/api/data/loans');
                const foundLoan = data.find(l => l.id === parseInt(id));

                if (foundLoan) {
                    setLoan(foundLoan);
                } else {
                    setError('Loan not found');
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching loan details:', err);
                setError('Failed to load loan details');
                setLoading(false);
            }
        };

        fetchLoanDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl text-gray-600">Loading application details...</div>
            </div>
        );
    }

    if (error || !loan) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
                <p className="text-gray-600 mb-6">{error || 'Loan not found'}</p>
                <Link to="/loans" className="text-primary hover:text-green-700 font-medium flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Loans
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Link to="/loans" className="inline-flex items-center text-white hover:text-green-200 mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Smart Loans
                </Link>

                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                    <div className="bg-primary px-6 py-8 sm:px-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{loan.title}</h1>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-800 text-green-100 border border-green-600">
                                        {loan.state}
                                    </span>
                                    {loan.crop && loan.crop !== 'All' && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                            {loan.crop}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right text-white">
                                <p className="text-sm opacity-90">Interest Rate</p>
                                <p className="text-2xl font-bold">{loan.interest}</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-8 sm:px-10">
                        {loan.description && (
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <FileText className="h-5 w-5 mr-2 text-primary" />
                                    About this Scheme
                                </h2>
                                <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                                    <p className="text-gray-700 leading-relaxed">{loan.description}</p>
                                </div>
                            </div>
                        )}

                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                                Application Process
                            </h2>
                            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                                <ol className="relative border-l border-blue-200 ml-3 space-y-6">
                                    {loan.applicationSteps && loan.applicationSteps.map((step, index) => (
                                        <li key={index} className="mb-10 ml-6">
                                            <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white border border-blue-200 text-blue-600 font-bold text-sm">
                                                {index + 1}
                                            </span>
                                            <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                                <p className="text-gray-700 font-medium">{step}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 pt-8 border-t border-gray-100">
                            <a
                                href={loan.officialLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:-translate-y-0.5"
                            >
                                Visit Official Website
                                <ExternalLink className="ml-2 -mr-1 h-5 w-5" />
                            </a>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500">
                                * You will be redirected to the official government portal. Please ensure you have all necessary documents ready.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoanApplication;
