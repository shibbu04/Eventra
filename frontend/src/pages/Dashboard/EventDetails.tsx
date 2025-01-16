import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  Edit, 
  Trash2,
  Presentation, 
  BookOpen,  
  Users as UsersIcon, 
  GraduationCap, 
  Sparkles 
} from 'lucide-react';
import { EVENT_ENDPOINTS } from '../../config/api';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Conference':
      return <Presentation className="h-20 w-20 text-blue-500" />;
    case 'Workshop':
      return <BookOpen className="h-20 w-20 text-green-500" />;
    case 'Seminar':
      return <GraduationCap className="h-20 w-20 text-purple-500" />;
    case 'Meetup':
      return <UsersIcon className="h-20 w-20 text-orange-500" />;
    default:
      return <Sparkles className="h-20 w-20 text-gray-500" />;
  }
};

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: number;
  attendees: Array<{
    _id: string;
    name: string;
    email: string;
    avatar: string;
  }>;
  organizer: {
    _id: string;
    name: string;
    avatar: string;
  };
  image: string;
  status: string;
}

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(EVENT_ENDPOINTS.GET_EVENT(id!), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        
        const data = await response.json();
        setEvent(data);
        
        // Check if current user is the organizer
        setIsOrganizer(currentUser._id === data.organizer._id);
        
        // Check if user has already joined
        setHasJoined(data.attendees.some((attendee: any) => attendee._id === currentUser._id));
        
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch event details');
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, currentUser._id]);

  const handleJoinEvent = async () => {
    if (hasJoined) {
      alert('You have already joined this event!');
      return;
    }

    try {
      const response = await fetch(EVENT_ENDPOINTS.JOIN_EVENT(id!), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to join event');
      }

      const updatedEvent = await response.json();
      setEvent(updatedEvent);
      setHasJoined(true);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await fetch(EVENT_ENDPOINTS.DELETE_EVENT(id!), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      navigate('/dashboard/my-events');
    } catch (error) {
      alert('Failed to delete event');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
        <p>{error || 'Event not found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
              e.currentTarget.parentElement?.appendChild(
                getCategoryIcon(event.category).type()
              );
            }}
          />
        ) : (
          getCategoryIcon(event.category)
        )}
      </div>
      
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
            <p className="text-gray-600">{event.description}</p>
          </div>
          
          {isOrganizer && (
            <div className="flex space-x-4">
              <button
                onClick={() => navigate(`/dashboard/events/${id}/edit`)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <Edit className="h-5 w-5" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDeleteEvent}
                className="flex items-center space-x-2 text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-5 w-5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-3" />
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-3" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-3" />
              <span>{event.location}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <Tag className="h-5 w-5 mr-3" />
              <span>{event.category}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-3" />
              <span>{event.attendees.length} / {event.capacity} attendees</span>
            </div>
            <div className="flex items-center">
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
          </div>
        </div>

        <div className="border-t pt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Attendees</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {event.attendees.map((attendee) => (
              <div key={attendee._id} className="flex items-center space-x-3">
                <img
                  src={attendee.avatar}
                  alt={attendee.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900">{attendee.name}</p>
                  <p className="text-sm text-gray-500">{attendee.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {!isOrganizer && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleJoinEvent}
              disabled={hasJoined || event.attendees.length >= event.capacity}
              className={`px-6 py-2 rounded-md ${
                hasJoined
                  ? 'bg-gray-300 cursor-not-allowed'
                  : event.attendees.length >= event.capacity
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-dark'
              }`}
            >
              {hasJoined 
                ? 'Already Joined' 
                : event.attendees.length >= event.capacity 
                ? 'Event Full' 
                : 'Join Event'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;