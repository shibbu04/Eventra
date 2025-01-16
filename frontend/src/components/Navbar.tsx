import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold text-gray-800">EventHub</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md">
              Home
            </Link>
            
            {/* <Link to="/login" className="flex items-center text-gray-700 hover:text-primary px-3 py-2 rounded-md">
              <LogIn className="h-5 w-5 mr-1" />
              Login
            </Link> */}
            
            <Link to="/signup" className="flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">
              <UserPlus className="h-5 w-5 mr-1" />
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;