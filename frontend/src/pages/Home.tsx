import React from 'react';
import { Calendar, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-purple-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Create Memorable Events with{' '}
            <span className="text-primary">EventHub</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your all-in-one platform for managing events, connecting with attendees,
            and creating unforgettable experiences.
          </p>
          
          <div className="flex justify-center gap-4 mb-16">
            <Link
              to="/signup"
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors text-lg font-semibold"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-lg hover:bg-primary hover:text-white transition-colors text-lg font-semibold"
            >
              Guest Login
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Scheduling</h3>
              <p className="text-gray-600">Create and manage events with just a few clicks</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
              <p className="text-gray-600">Stay connected with attendees in real-time</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Professional Tools</h3>
              <p className="text-gray-600">Access powerful event management features</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;