import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute, { AdminRoute } from './components/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetailsPage from './pages/DestinationDetailsPage';
import ToursPage from './pages/ToursPage';
import TourDetailsPage from './pages/TourDetailsPage';
import HotelsPage from './pages/HotelsPage';
import HotelDetailsPage from './pages/HotelDetailsPage';

// Customer Protected Pages
import TourBookingPage from './pages/TourBookingPage';
import HotelBookingPage from './pages/HotelBookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import BookingDetailsPage from './pages/BookingDetailsPage';
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDestinations from './pages/admin/AdminDestinations';
import AdminTours from './pages/admin/AdminTours';
import AdminHotels from './pages/admin/AdminHotels';
import AdminRooms from './pages/admin/AdminRooms';
import AdminBookings from './pages/admin/AdminBookings';
import AdminReviews from './pages/admin/AdminReviews';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {!isAdminRoute && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:id" element={<DestinationDetailsPage />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/tours/:id" element={<TourDetailsPage />} />
          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/hotels/:id" element={<HotelDetailsPage />} />

          {/* Customer Protected Routes */}
          <Route
            path="/tours/:id/book"
            element={
              <ProtectedRoute>
                <TourBookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotels/:id/book"
            element={
              <ProtectedRoute>
                <HotelBookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings/:id"
            element={
              <ProtectedRoute>
                <BookingDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="destinations" element={<AdminDestinations />} />
            <Route path="tours" element={<AdminTours />} />
            <Route path="hotels" element={<AdminHotels />} />
            <Route path="rooms" element={<AdminRooms />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="reviews" element={<AdminReviews />} />
          </Route>
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <AppContent />
    </AuthProvider>
  );
}

export default App;