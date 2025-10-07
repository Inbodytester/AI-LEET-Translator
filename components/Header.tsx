import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { BuyMeACoffeeButton } from './BuyMeACoffeeButton';
import type { Theme } from '../types';

interface HeaderProps {
    theme: Theme;
    onThemeToggle: () => void;
}

const TerminalIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ theme, onThemeToggle }) => {
  return (
    <header className="py-4 px-6 bg-white/80 dark:bg-transparent backdrop-blur-sm shadow-md dark:shadow-lg dark:shadow-cyan-500/10">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
            <TerminalIcon />
            <h1 className="text-3xl font-bold text-cyan-500 dark:text-cyan-400 tracking-wider">
            AI L33T Tr4nsl4t0r
            </h1>
        </div>
        <div className="flex items-center space-x-4">
            <BuyMeACoffeeButton />
            <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </div>
      </div>
    </header>
  );
};