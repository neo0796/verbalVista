'use client';

import { FC, useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { HiPaperAirplane } from "react-icons/hi"; 
import Image from "next/image"; // Send icon

const Home: FC = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [account, setAccount] = useState<string | null>(null);
    const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([
        { text: "Hi!", sender: 'user' },
        { text: "Hello! How can I help you today?", sender: 'bot' },
    ]);
    const [inputText, setInputText] = useState("");
    const heroRef = useRef<HTMLDivElement>(null); // Ref for hero text animation
    const chatRef = useRef<HTMLDivElement>(null); // Ref for chat message animation
    const descriptionRef = useRef<HTMLDivElement>(null); // Ref for description

    useEffect(() => {
        // GSAP Hero Text Animation with simple slide effect from the left
        if (heroRef.current) {
            gsap.fromTo(heroRef.current,
                { x: -100 }, // Start position (100px to the left)
                { x: 0, duration: 1.5, ease: "power3.out" } // Slide in
            );
        }
    }, []);

    useEffect(() => {
        // GSAP Chat Message Animation
        if (chatRef.current) {
            gsap.fromTo(chatRef.current,
                { opacity: 0, x: 100 },
                { opacity: 1, x: 0, duration: 1.2, ease: "power3.out" }
            );
        }
    }, [messages]); // Re-run the animation when a new message is added

    const handleSendMessage = async () => {
        if (inputText.trim()) {
            setMessages((prev) => [...prev, { text: inputText, sender: 'user' }]);
            setInputText("");

            try {
                const response = await fetch('http://127.0.0.1:8000/chat_gen', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt: inputText }), // Use the inputText as prompt
                });

                const data = await response.json();
                setMessages((prev) => [...prev, { text: data.ans, sender: 'bot' }]);
            } catch (error) {
                console.error("Error sending message to backend:", error);
            }
        }
    };

    return (
        <div
            className="h-[220vh] bg-gradient-to-br from-gray-900 to-black relative overflow-hidden"
            style={{
                backgroundImage: `url(https://i.pinimg.com/originals/bc/a1/90/bca19096a0def30ba652264dbce98d88.jpg)`, // Replace with your image URL
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="flex h-[100vh] pt-24">
                {/* Hero Text - 2/3rd */}
                <div ref={heroRef} className="w-2/3 flex flex-col items-center justify-center text-center px-6">
                    <h1 className="text-7xl font-extrabold text-gray-200 shadow-md">
                        Elevate Your Writing: Your AI Partner for Mastering English!
                    </h1>
                </div>

                {/* Chatbot - Fixed Position with Reduced Height */}
                <div className="fixed right-8 bottom-8 w-[420px] h-[calc(100%-6rem-30px)] rounded-lg p-6 flex flex-col bg-black bg-opacity-90 backdrop-blur-lg border border-gray-600 shadow-lg"
                     style={{
                         boxShadow: '0 0 20px rgba(128, 0, 128, 0.8), 0 0 30px rgba(128, 0, 128, 0.7), 0 0 40px rgba(128, 0, 128, 0.6)',
                     }}>
                    <h2 className="text-xl font-bold text-gray-300 mb-4">Confess:</h2>
                    <div ref={chatRef} className="flex-grow overflow-y-auto bg-white/10 p-4 rounded-lg mb-4 backdrop-blur-md">
                        {/* Chat Messages */}
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex mb-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-3 rounded-lg max-w-xs transition-transform duration-300 ${msg.sender === 'user' ? 'bg-purple-500 text-white transform hover:scale-105' : 'bg-gray-700 text-gray-300 transform hover:scale-105'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSendMessage();
                                }
                            }}
                            className="flex-grow p-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-shadow duration-200"
                            placeholder="Type your message..."
                        />
                        <div className="ml-2">
                            <button
                                onClick={handleSendMessage}
                                className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-3 rounded-lg transition-transform duration-200 transform hover:scale-105 flex items-center"
                            >
                                <HiPaperAirplane className="text-xl" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description Section */}
            <div ref={descriptionRef} className="absolute w-1/2 mx-auto top-[80vh] left-16 p-6">
                <div className="bg-black bg-opacity-80 rounded-lg p-6 shadow-lg transition-transform duration-300 hover:scale-105"
                    style={{
                        border: '1px solid rgba(0, 128, 128, 0.8)', // Adjusted to match the theme
                        boxShadow: '0 0 20px rgba(0, 128, 128, 0.7), 0 0 30px rgba(0, 128, 128, 0.6), 0 0 40px rgba(0, 128, 128, 0.5)',
                    }}
                >
                    <h2 className="text-4xl font-bold text-gray-200 mb-2">Description</h2>
                    <p className="mt-4 text-lg leading-relaxed text-gray-400">
                        This English learning app is designed to revolutionize how users master the language, offering an interactive and personalized educational experience. With an AI-powered chatbot, users can practice their skills, ask questions, and receive instant feedback tailored to their proficiency level.
                        <br />
                        <br />
                        Example prompts include:
                        <br />
                        <br />
                        👉 “Can you help me understand the difference between ‘affect’ and ‘effect’?”<br />
                        👉 “How do I write a formal email for a job application?”<br />
                        👉 “Can you give me tips on improving my pronunciation?”<br />
                        👉 “What’s the best way to study for my English grammar exam?”<br />
                        👉 “Can you suggest fun exercises to improve my vocabulary?”<br />
                        👉 “How do I structure an essay for an English class?”<br />
                        <br />
                        This app aims to make learning English accessible and enjoyable, helping users improve their skills and confidence in both written and spoken English. By leveraging AI, it provides personalized guidance, empowering users to succeed academically and professionally.
                    </p>
                </div>
            </div>

            {/* Footer with Blinking Text */}
            <footer className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="text-center">
                    <p className="text-gray-300 text-xl flex items-center justify-center">
                        <span className="px-2">Powered by</span>
                        <Image
                            src="https://www.gaianet.ai/images/logo.png" // Replace with your image URL
                            alt="Description of image"
                            width={50} // Specify the width
                            height={30} // Specify the height
                        />
                    </p>
                </div>
            </footer>

            <style jsx>{`
                .blinking {
                    animation: blinkingText 1.5s infinite;
                }

                @keyframes blinkingText {
                    0% { opacity: 1; }
                    50% { opacity: 0; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Home;
