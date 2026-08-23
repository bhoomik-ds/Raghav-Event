import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

/* Layout Components */
import Header from "./components/Header";
import Footer from "./components/Footer";

/* Pages & Components */
import EventInfo from "./components/EventInfo";
import TicketPage from "./components/TicketPage";
import PaymentPage from "./components/PaymentPage";
import ViewTicket from "./components/ViewTicket";
import MyTickets from "./components/MyTickets";
import AuthPage from "./components/AuthPage";
import ProfilePage from "./components/ProfilePage";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-[#fffaf1] selection:bg-[#b54278] selection:text-white">
        <Header />
        <div className="flex-1">
          <Routes>
            {/* Home & Discovery */}
            <Route path="/" element={<EventInfo />} />
            <Route path="/events" element={<EventInfo />} />

            {/* Booking & Checkout */}
            <Route path="/TicketBooking" element={<TicketPage />} />
            <Route path="/ticket-booking" element={<TicketPage />} />
            <Route path="/book" element={<TicketPage />} />
            <Route path="/payment/:id" element={<PaymentPage />} />
            <Route path="/view-ticket/:id" element={<ViewTicket />} />

            {/* Authentication */}
            <Route path="/signin" element={<AuthPage mode="signin" />} />
            <Route path="/login" element={<AuthPage mode="signin" />} />
            <Route path="/signup" element={<AuthPage mode="signup" />} />
            <Route path="/register" element={<AuthPage mode="signup" />} />

            {/* Protected Attendee Routes */}
            <Route
              path="/my-tickets"
              element={
                <ProtectedRoute>
                  <MyTickets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-passes"
              element={
                <ProtectedRoute>
                  <MyTickets />
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

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute admin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Tier shortcuts */}
            <Route path="/PlatinumSeating" element={<TicketPage />} />
            <Route path="/GeneralStanding" element={<TicketPage />} />
            <Route path="/FanPitStanding" element={<TicketPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
