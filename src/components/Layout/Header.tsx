import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, Settings, Home } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg group-hover:scale-105 transition-transform duration-200">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              HackFinder
            </span>
          </Link>

          <nav className="flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                isActive('/') 
                  ? 'bg-purple-50 text-purple-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Home className="h-4 w-4" />
              <span className="font-medium">Hackathons</span>
            </Link>
            
            <Link
              to="/admin"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                isActive('/admin') 
                  ? 'bg-purple-50 text-purple-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span className="font-medium">Admin</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;