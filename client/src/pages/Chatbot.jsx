import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User } from 'lucide-react';

const Chatbot = () => {
    const [isListening, setIsListening] = useState(false);
    const [selectedLang, setSelectedLang] = useState('en-IN');
    const recognitionRef = useRef(null);

    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your Rootify AI assistant. Ask me about crop prices, loans, or farming tips.", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const languages = [
        { code: 'en-IN', name: 'English (India)' },
        { code: 'hi-IN', name: 'Hindi' },
        { code: 'bn-IN', name: 'Bengali' },
        { code: 'te-IN', name: 'Telugu' },
        { code: 'mr-IN', name: 'Marathi' },
        { code: 'ta-IN', name: 'Tamil' },
        { code: 'gu-IN', name: 'Gujarati' },
        { code: 'kn-IN', name: 'Kannada' },
        { code: 'ml-IN', name: 'Malayalam' },
        { code: 'pa-IN', name: 'Punjabi' }
    ];

    useEffect(() => {
        try {
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = false;
            }
        } catch (error) {
            console.error("Speech Recognition initialization failed:", error);
        }

        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) {
                    // Ignore error on stop
                }
            }
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = selectedLang;
        }
    }, [selectedLang]);

    const startListening = () => {
        if (recognitionRef.current) {
            setIsListening(true);
            recognitionRef.current.start();

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                handleSend(null, transcript); // Auto-send
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        } else {
            alert("Voice recognition is not supported in this browser.");
        }
    };

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop previous speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = selectedLang; // Try to match the selected language
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleSend = async (e, voiceInput = null) => {
        if (e) e.preventDefault();
        const textToSend = voiceInput || input;
        if (!textToSend.trim()) return;

        const userMessage = { id: Date.now(), text: textToSend, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const { data } = await axios.post('http://localhost:5001/api/data/chat', { message: textToSend });
            const botMessage = { id: Date.now() + 1, text: data.reply, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
            speak(data.reply); // Speak the response
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = { id: Date.now() + 1, text: "Sorry, I'm having trouble connecting right now.", sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
            speak("Sorry, I'm having trouble connecting right now.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col">
            <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Bot className="h-6 w-6 text-primary mr-2" />
                    AI Agri-Expert
                </h2>
                <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                    {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                </select>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="max-w-3xl mx-auto space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex items-start max-w-xs sm:max-w-md ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-green-600 ml-3' : 'bg-blue-600 mr-3'}`}>
                                    {msg.sender === 'user' ? <User className="h-6 w-6 text-white" /> : <Bot className="h-6 w-6 text-white" />}
                                </div>
                                <div className={`p-4 rounded-lg shadow-sm ${msg.sender === 'user' ? 'bg-green-100 text-gray-800' : 'bg-white text-gray-800'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="flex items-start max-w-xs sm:max-w-md flex-row">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 mr-3 flex items-center justify-center">
                                    <Bot className="h-6 w-6 text-white" />
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="bg-white border-t border-gray-200 p-4">
                <div className="max-w-3xl mx-auto">
                    <form onSubmit={handleSend} className="flex space-x-4 items-center">
                        <button
                            type="button"
                            onClick={startListening}
                            className={`p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-200 hover:bg-gray-300'}`}
                            title="Speak"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        </button>
                        <input
                            type="text"
                            className="flex-1 focus:ring-primary focus:border-primary block w-full min-w-0 rounded-full sm:text-sm border-gray-300 p-3 bg-gray-100"
                            placeholder="Type or speak your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
