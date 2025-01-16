import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './components/DashboardLayout';
import EventDashboard from './pages/Dashboard/EventDashboard';
import CreateEvent from './pages/Dashboard/CreateEvent';
import EditEvent from './pages/Dashboard/EditEvent';
import EventDetails from './pages/Dashboard/EventDetails';
import AttendeesManagement from './pages/Dashboard/AttendeesManagement';
import UserSettings from './pages/Dashboard/UserSettings';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <Home />
              <Footer />
            </div>
          }
        />
        <Route
          path="/login"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <Login />
              <Footer />
            </div>
          }
        />
        <Route
          path="/signup"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <Signup />
              <Footer />
            </div>
          }
        />

        {/* Protected dashboard routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<EventDashboard />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="events/:id/edit" element={<EditEvent />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="my-events" element={<EventDashboard />} />
          <Route path="attendees" element={<AttendeesManagement />} />
          <Route path="settings" element={<UserSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;