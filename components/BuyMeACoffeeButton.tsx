import React from 'react';

const CoffeeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 11.286c0 3.571-2.286 6.571-5.143 6.571-2.857 0-5.143-3-5.143-6.571 0-2.857 1.143-5.143 2.571-5.143h5.143c1.429 0 2.571 2.286 2.571 5.143zM14.286 17.857v1.429c0 1.143-.857 2-2 2s-2-.857-2-2v-1.429" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 11.286H22v2.857h-2.572" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.571 6.143S5.714 4 8 4s3.429 2.143 3.429 2.143" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6.143S9.143 4 11.429 4s3.429 2.143 3.429 2.143" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.429 6.143S12.571 4 14.857 4s3.429 2.143 3.429 2.143" />
    </svg>
);

export const BuyMeACoffeeButton: React.FC = () => {
    return (
        <a
            href="https://buymeacoffee.com/gabethevet"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 text-sm font-semibold text-gray-800 bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-yellow-500 transition-all duration-200 transform hover:scale-105"
            aria-label="Support me on Buy Me a Coffee"
        >
            <CoffeeIcon />
            Support Me
        </a>
    );
};