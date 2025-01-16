import React from 'react';
import { Github, Linkedin, Heart, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white shadow-md mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-gray-600">
            <span>Developed by Shivam</span>
            <Heart className="h-4 w-4 text-red-500 ml-1" fill="currentColor" />
          </div>
          
          <div className="flex space-x-4">
            <a
              href="https://github.com/shibbu04/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href="https://shivam04.tech/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary"
            >
              <Globe className="h-6 w-6" />
            </a>
            <a
              href="https://linkedin.com/in/shivamsingh57680/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary"
            >
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;