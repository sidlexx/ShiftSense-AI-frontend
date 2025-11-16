import React from 'react';
import { Bell, Search, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  children?: React.ReactNode;
  onToggleTheme: () => void;
  currentTheme: string;
}

const Header: React.FC<HeaderProps> = ({ children, onToggleTheme, currentTheme }) => {
  return (
    <header className="flex-shrink-0 bg-card border-b border-border">
      <div className="flex items-center justify-between p-4">
         <div className="flex items-center space-x-4">
          {children}
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search employees, predictions..."
              className="w-64 pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button onClick={onToggleTheme} className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            {currentTheme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
          <button className="relative text-muted-foreground hover:text-foreground">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-critical rounded-full"></span>
          </button>
          <div className="flex items-center space-x-2">
            <img
              src="https://picsum.photos/id/237/40/40"
              alt="User"
              className="h-9 w-9 rounded-full"
            />
            <div className='hidden sm:block'>
              <div className="text-sm font-semibold">Alex Manager</div>
              <div className="text-xs text-muted-foreground">Sr. Operations Manager</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;