import React, { useState, useEffect } from 'react';
import { User, Mail, Camera } from 'lucide-react';
import { AUTH_ENDPOINTS } from '../../config/api';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

const UserSettings = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setProfile(user);
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(AUTH_ENDPOINTS.UPDATE_PROFILE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profile)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update profile');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">User Settings</h2>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-500 p-4 rounded-md mb-6">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-32 h-32 rounded-full"
            />
            <button
              type="button"
              className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary-dark"
            >
              <Camera className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserSettings;