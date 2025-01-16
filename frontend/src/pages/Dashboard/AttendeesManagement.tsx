import React, { useState, useEffect } from 'react';
import { Search, Filter, Mail } from 'lucide-react';
import { EVENT_ENDPOINTS } from '../../config/api';

interface Attendee {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  eventsJoined: number;
}

const AttendeesManagement = () => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const response = await fetch(EVENT_ENDPOINTS.GET_ATTENDEES, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch attendees');
        }
        
        const data = await response.json();
        setAttendees(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch attendees');
        setLoading(false);
      }
    };

    fetchAttendees();
  }, []);

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch = attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attendee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'active') return matchesSearch && attendee.eventsJoined > 5;
    return matchesSearch && attendee.eventsJoined <= 5;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Attendees Management</h2>
        <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search attendees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div className="relative flex-1 md:flex-none">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full md:w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Attendees</option>
              <option value="active">Active ({'>'}5 events)</option>
              <option value="inactive">Inactive (≤5 events)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendee
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Events Joined
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAttendees.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No attendees found
                </td>
              </tr>
            ) : (
              filteredAttendees.map((attendee) => (
                <tr key={attendee._id}>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={attendee.avatar}
                        alt={attendee.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {attendee.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{attendee.email}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{attendee.eventsJoined}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-primary hover:text-primary-dark transition-colors"
                      onClick={() => window.location.href = `mailto:${attendee.email}`}
                      title="Send email"
                    >
                      <Mail className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendeesManagement;