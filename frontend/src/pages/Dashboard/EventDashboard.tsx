import React, { useState, useEffect } from 'react';
import { PlusCircle, Calendar, Users, MapPin, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { io } from 'socket.io-client';
import { useNavigate, useLocation } from 'react-router-dom';
import { EVENT_ENDPOINTS, SOCKET_URL } from '../../config/api';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: number;
  attendees: string[];
  image: string;
  status: string;
  organizer: {
    _id: string;
    name: string;
    avatar: string;
  };
}

const EventDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const isMyEvents = location.pathname === '/dashboard/my-events';

  useEffect(() => {
    const socket = io(SOCKET_URL);

    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const endpoint = isMyEvents ? EVENT_ENDPOINTS.GET_MY_EVENTS : EVENT_ENDPOINTS.GET_ALL;
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch events');
        setLoading(false);
      }
    };

    fetchEvents();

    socket.on('newEvent', (event) => {
      setEvents((prev) => [...prev, event]);
    });

    socket.on('eventUpdated', (updatedEvent) => {
      setEvents((prev) =>
        prev.map((event) =>
          event._id === updatedEvent._id ? updatedEvent : event
        )
      );
    });

    socket.on('eventDeleted', (eventId) => {
      setEvents((prev) => prev.filter((event) => event._id !== eventId));
    });

    return () => {
      socket.disconnect();
    };
  }, [isMyEvents]);

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await fetch(EVENT_ENDPOINTS.DELETE_EVENT(eventId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      setEvents(prev => prev.filter(event => event._id !== eventId));
    } catch (error) {
      alert('Failed to delete event');
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isMyEvents ? 'My Events' : 'Event Dashboard'}
        </h1>
        <button 
          onClick={() => navigate('/dashboard/create-event')}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Create Event</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Conference">Conference</option>
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Seminar</option>
              <option value="Meetup">Meetup</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No events found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={event.image || 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2000'}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    event.status === 'upcoming'
                      ? 'bg-green-100 text-green-800'
                      : event.status === 'ongoing'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-2" />
                    <span>{event.attendees.length} / {event.capacity} attendees</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <img
                      src={event.organizer.avatar}
                      alt={event.organizer.name}
                      className="h-6 w-6 rounded-full"
                    />
                    <span className="text-sm text-gray-600">{event.organizer.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {event.organizer._id === currentUser._id && isMyEvents && (
                      <>
                        <button
                          onClick={() => navigate(`/dashboard/events/${event._id}/edit`)}
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit event"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          title="Delete event"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => navigate(`/dashboard/events/${event._id}`)}
                      className="text-primary hover:text-primary-dark font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventDashboard;