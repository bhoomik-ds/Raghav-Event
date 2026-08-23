import React, { useEffect, useState, useCallback } from "react";
import {
  BarChart3,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Ticket,
  Users,
  X,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Download,
  ShieldCheck,
  Sparkles,
  MapPin,
  Clock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { api, signOut, user, showToast } = useAuth();
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [payments, setPayments] = useState([]);
  const [section, setSection] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewBookingModal, setViewBookingModal] = useState(null);

  // Event form state
  const initialEventForm = {
    title: "",
    category: "Garba",
    about: "",
    highlights: "Live Dhol, Traditional Orchestra, Satyam Party Plot",
    date: "2026-10-11",
    time: "7:00 PM Onwards",
    duration: "10 Nights (11-20 October)",
    venueName: "Satyam Party Plot",
    venueCity: "Junagadh",
    venueAddress: "Satyam Party Plot, Zanzarda Chokdi, Junagadh",
    organizer: "Raghav Events Junagadh",
    bannerImage: "/images/background.png",
    status: "published",
    ticketTypes: [
      {
        name: "Family Pass",
        price: 7499,
        totalSeats: 500,
        description: "4 Person Max",
      },
      {
        name: "Couple Pass",
        price: 3999,
        totalSeats: 800,
        description: "1 Male & Female Only",
      },
      {
        name: "Children Pass",
        price: 1499,
        totalSeats: 400,
        description: "5 to 12 years Only",
      },
    ],
  };
  const [eventForm, setEventForm] = useState(initialEventForm);

  const fetchAllData = useCallback(async () => {
    try {
      const [dashRes, eventRes, bookingRes, userRes, paymentRes] =
        await Promise.all([
          api.get("api/admin/dashboard"),
          api.get("api/admin/events"),
          api.get("api/admin/bookings"),
          api.get("api/admin/users"),
          api.get("api/admin/payments"),
        ]);

      setStats(dashRes.data?.stats || null);
      setEvents(eventRes.data?.events || []);
      setBookings(bookingRes.data?.bookings || []);
      setUsersList(userRes.data?.users || []);
      setPayments(paymentRes.data?.payments || []);
    } catch (err) {
      console.error("Admin data load error:", err);
      showToast("Failed to fetch admin data.", "error");
    }
  }, [api, showToast]);

  useEffect(() => {
    queueMicrotask(fetchAllData);
  }, [fetchAllData]);

  // Handle Event Creation & Update
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.title.trim()) {
      showToast("Event title is required", "warning");
      return;
    }

    const payload = {
      title: eventForm.title,
      category: eventForm.category,
      about: eventForm.about,
      highlights:
        typeof eventForm.highlights === "string"
          ? eventForm.highlights
              .split(",")
              .map((h) => h.trim())
              .filter(Boolean)
          : eventForm.highlights,
      date: eventForm.date,
      time: eventForm.time,
      duration: eventForm.duration,
      venue: {
        name: eventForm.venueName,
        city: eventForm.venueCity,
        address: eventForm.venueAddress,
      },
      organizer: eventForm.organizer,
      bannerImage: eventForm.bannerImage,
      status: eventForm.status,
      ticketTypes: eventForm.ticketTypes,
    };

    try {
      if (editingEvent) {
        await api.put(`api/admin/events/${editingEvent._id}`, payload);
        showToast("Event updated successfully!", "success");
      } else {
        await api.post("api/admin/events", payload);
        showToast("New event published!", "success");
      }
      setEventModalOpen(false);
      setEditingEvent(null);
      setEventForm(initialEventForm);
      fetchAllData();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to save event.",
        "error",
      );
    }
  };

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      category: event.category || "Garba",
      about: event.about || "",
      highlights: (event.highlights || []).join(", "),
      date: event.date ? new Date(event.date).toISOString().split("T")[0] : "",
      time: event.time || "7:00 PM Onwards",
      duration: event.duration || "5 hours",
      venueName: event.venue?.name || "",
      venueCity: event.venue?.city || "",
      venueAddress: event.venue?.address || "",
      organizer: event.organizer || "Raghav Events",
      bannerImage: event.bannerImage || "/images/background.png",
      status: event.status || "published",
      ticketTypes: (event.ticketTypes || []).map((t) => ({
        _id: t._id,
        name: t.name,
        price: t.price,
        totalSeats: t.totalSeats,
        availableSeats: t.availableSeats,
        description: t.description || "",
      })),
    });
    setEventModalOpen(true);
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this event?")) return;
    try {
      await api.delete(`api/admin/events/${id}`);
      showToast("Event cancelled successfully", "info");
      fetchAllData();
    } catch {
      showToast("Failed to delete event", "error");
    }
  };

  // Toggle user status
  const handleToggleUserStatus = async (userItem) => {
    const nextStatus = userItem.status === "active" ? "disabled" : "active";
    try {
      await api.patch(`api/admin/users/${userItem._id}/status`, {
        status: nextStatus,
      });
      showToast(`User ${userItem.name} marked as ${nextStatus}`, "success");
      fetchAllData();
    } catch {
      showToast("Failed to update user status", "error");
    }
  };

  // Export Bookings to CSV
  const handleExportCSV = () => {
    if (bookings.length === 0) {
      showToast("No bookings to export", "warning");
      return;
    }

    const headers = [
      "Booking ID",
      "Guest Name",
      "Mobile",
      "Email",
      "City",
      "Event",
      "Passes",
      "Amount (INR)",
      "Payment Status",
      "Razorpay ID",
      "Date",
    ];
    const rows = bookings.map((b) => [
      `"${b.bookingId || b._id}"`,
      `"${b.guestName}"`,
      `"${b.mobile}"`,
      `"${b.userEmail || ""}"`,
      `"${b.city || ""}"`,
      `"${b.eventId?.title || ""}"`,
      `"${(b.tickets || []).map((t) => `${t.ticketType} x${t.quantity}`).join(", ")}"`,
      b.finalAmount || b.totalAmount,
      b.paymentStatus,
      `"${b.razorpayPaymentId || ""}"`,
      `"${new Date(b.createdAt).toLocaleDateString("en-IN")}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `raghav_events_bookings_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Bookings exported to CSV!", "success");
  };

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Events", icon: CalendarDays },
    { name: "Bookings", icon: Ticket },
    { name: "Users", icon: Users },
    { name: "Payments", icon: CreditCard },
  ];

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#FBF8F2] text-[#292929]">
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside
          className={`${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 left-0 z-50 w-72 bg-[#242424] p-6 text-white transition-transform duration-300 md:relative md:translate-x-0 shadow-2xl flex flex-col justify-between`}
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-[#E8DCC5]/40 bg-white p-1">
                  <img
                    src="/images/Logo.jpeg"
                    alt="Raghav Events"
                    className="h-8 w-8 object-contain rounded-md"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.25em] text-[#C9A96E]">
                    Raghav Events
                  </p>
                  <p className="text-base font-extrabold tracking-tight text-white">
                    Admin Studio
                  </p>
                </div>
              </div>
              <button
                className="md:hidden text-slate-400 hover:text-white"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X />
              </button>
            </div>

            <nav className="mt-10 space-y-2">
              {navItems.map(({ name, icon }) => (
                <button
                  key={name}
                  onClick={() => {
                    setSection(name);
                    setMenuOpen(false);
                    setSearchQuery("");
                  }}
                  className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-left text-xs font-bold transition-all ${
                    section === name
                      ? "bg-[#3B3B3B] text-[#E5D2A8] border-l-2 border-[#C9A96E] shadow-sm"
                      : "text-[#FBF8F2]/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {React.createElement(icon, {
                    size: 16,
                    className: section === name ? "text-[#C9A96E]" : "",
                  })}
                  <span>{name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t border-white/10">
            <div className="mb-4 text-xs text-[#FBF8F2]/80">
              <p className="font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-[#C9A96E]">Administrator Access</p>
            </div>
            <button
              onClick={async () => {
                await signOut();
                window.location.href = "/signin";
              }}
              className="flex w-full items-center gap-3 text-xs font-bold text-rose-300 hover:text-white transition"
            >
              <LogOut size={15} /> Sign Out Admin
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="min-w-0 flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="flex items-center justify-between border-b border-[#E8DCC5] bg-white px-6 py-4 shadow-xs">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMenuOpen(true)}
                className="md:hidden grid h-10 w-10 place-items-center rounded-xl bg-[#FBF8F2] text-[#3B3B3B] border border-[#E8DCC5]"
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>

              <div>
                <span className="text-[10px] font-bold text-[#77736B] uppercase tracking-wider">
                  Control Center
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#292929]">
                  {section}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {section === "Events" && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingEvent(null);
                    setEventForm(initialEventForm);
                    setEventModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#3B3B3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#292929] shadow-xs transition"
                >
                  <Plus size={15} className="text-[#E5D2A8]" /> Add Event
                </button>
              )}

              {section === "Bookings" && (
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DCC5] bg-[#FBF8F2] px-4 py-2 text-xs font-bold text-[#3B3B3B] hover:bg-[#E8DCC5]/40 shadow-xs"
                >
                  <Download size={14} className="text-[#C9A96E]" /> Export CSV
                </button>
              )}
            </div>
          </header>

          {/* Section Body */}
          <div className="p-6 sm:p-8 flex-1">
            {/* Dashboard Overview */}
            {section === "Dashboard" && (
              <div className="space-y-6 sm:space-y-8">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    [
                      "Total Revenue",
                      `₹${(stats?.totalRevenue || 0).toLocaleString("en-IN")}`,
                      CreditCard,
                      "text-[#C9A96E] bg-[#FBF8F2] border border-[#E8DCC5]",
                    ],
                    [
                      "Passes Sold",
                      (stats?.ticketsSold || 0).toLocaleString("en-IN"),
                      BarChart3,
                      "text-[#3B3B3B] bg-[#FBF8F2] border border-[#E8DCC5]",
                    ],
                    [
                      "Total Bookings",
                      stats?.totalBookings || 0,
                      Ticket,
                      "text-[#C9A96E] bg-[#FBF8F2] border border-[#E8DCC5]",
                    ],
                    [
                      "Active Events",
                      stats?.activeEvents || stats?.totalEvents || 0,
                      CalendarDays,
                      "text-[#3B3B3B] bg-[#FBF8F2] border border-[#E8DCC5]",
                    ],
                    [
                      "Registered Users",
                      stats?.totalUsers || 0,
                      Users,
                      "text-[#C9A96E] bg-[#FBF8F2] border border-[#E8DCC5]",
                    ],
                    [
                      "Festival Arenas",
                      stats?.upcomingEvents || 0,
                      Sparkles,
                      "text-[#3B3B3B] bg-[#FBF8F2] border border-[#E8DCC5]",
                    ],
                  ].map(([label, value, statIcon, colorClass]) => (
                    <div
                      key={label}
                      className="rounded-2xl sm:rounded-3xl border border-[#E8DCC5] bg-white p-6 shadow-xs flex items-center justify-between"
                    >
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#77736B] mb-1">
                          {label}
                        </p>
                        <p className="text-2xl sm:text-3xl font-extrabold text-[#292929] tracking-tight">
                          {value}
                        </p>
                      </div>
                      <div
                        className={`grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-2xl ${colorClass}`}
                      >
                        {React.createElement(statIcon, { size: 24 })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Bookings Box */}
                <div className="rounded-2xl sm:rounded-3xl border border-[#E8DCC5] bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base sm:text-lg font-extrabold text-[#292929]">
                      Recent Bookings
                    </h3>
                    <button
                      onClick={() => setSection("Bookings")}
                      className="text-xs font-bold text-[#C9A96E] hover:underline"
                    >
                      View all ({bookings.length})
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-semibold">
                      <thead className="bg-[#FBF8F2] text-[10px] uppercase tracking-wider text-[#77736B] border-b border-[#E8DCC5]">
                        <tr>
                          <th className="p-3">Booking ID</th>
                          <th className="p-3">Attendee</th>
                          <th className="p-3">Event</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8DCC5]/60">
                        {bookings.slice(0, 5).map((b) => (
                          <tr key={b._id} className="hover:bg-[#FBF8F2]/60">
                            <td className="p-3 font-mono font-bold text-[#3B3B3B]">
                              {b.bookingId || b._id}
                            </td>
                            <td className="p-3 text-[#292929]">
                              {b.guestName}
                            </td>
                            <td className="p-3 text-[#77736B]">
                              {b.eventId?.title || "Garba Night"}
                            </td>
                            <td className="p-3 font-extrabold text-[#292929]">
                              ₹{b.finalAmount || b.totalAmount}
                            </td>
                            <td className="p-3">
                              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-800">
                                {b.paymentStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Events Manager Tab */}
            {section === "Events" && (
              <div className="rounded-2xl sm:rounded-3xl border border-[#E8DCC5] bg-white p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-80">
                    <Search
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77736B]"
                    />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search events by title or city..."
                      className="w-full rounded-xl border border-[#E8DCC5] bg-[#FBF8F2] pl-10 pr-4 py-2.5 text-xs font-semibold outline-none focus:border-[#C9A96E]"
                    />
                  </div>
                  <span className="text-xs font-bold text-[#77736B]">
                    Total: {events.length} celebrations
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold">
                    <thead className="bg-[#FBF8F2] text-[10px] uppercase tracking-wider text-[#77736B] border-b border-[#E8DCC5]">
                      <tr>
                        <th className="p-3">Title & Category</th>
                        <th className="p-3">Date & Time</th>
                        <th className="p-3">Venue</th>
                        <th className="p-3">Pass Tiers</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8DCC5]/60">
                      {events
                        .filter(
                          (e) =>
                            !searchQuery ||
                            e.title
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            e.venue?.city
                              ?.toLowerCase()
                              .includes(searchQuery.toLowerCase()),
                        )
                        .map((event) => (
                          <tr key={event._id} className="hover:bg-[#FBF8F2]/60">
                            <td className="p-3">
                              <p className="font-extrabold text-[#292929] text-sm">
                                {event.title}
                              </p>
                              <span className="text-[10px] font-bold text-[#3B3B3B] bg-[#FBF8F2] px-2 py-0.5 rounded border border-[#E8DCC5]">
                                {event.category}
                              </span>
                            </td>
                            <td className="p-3 text-[#77736B]">
                              <p className="text-[#292929] font-bold">
                                {new Date(event.date).toLocaleDateString(
                                  "en-IN",
                                )}
                              </p>
                              <p className="text-[11px] text-[#77736B]">
                                {event.time}
                              </p>
                            </td>
                            <td className="p-3 text-[#77736B]">
                              <p className="text-[#292929] font-bold">
                                {event.venue?.name}
                              </p>
                              <p className="text-[11px] text-[#77736B]">
                                {event.venue?.city}
                              </p>
                            </td>
                            <td className="p-3">
                              <span className="text-[#292929] font-bold">
                                {event.ticketTypes?.length || 0} tiers
                              </span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                                  event.status === "published"
                                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {event.status}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-1.5">
                              <button
                                onClick={() => handleEditClick(event)}
                                className="rounded-lg p-1.5 text-[#3B3B3B] hover:bg-[#FBF8F2] hover:text-[#C9A96E]"
                                title="Edit Event"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(event._id)}
                                className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50"
                                title="Cancel Event"
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bookings Manager Tab */}
            {section === "Bookings" && (
              <div className="rounded-2xl sm:rounded-3xl border border-[#E8DCC5] bg-white p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-80">
                    <Search
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77736B]"
                    />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by ID, name or phone..."
                      className="w-full rounded-xl border border-[#E8DCC5] bg-[#FBF8F2] pl-10 pr-4 py-2.5 text-xs font-semibold outline-none focus:border-[#C9A96E]"
                    />
                  </div>
                  <span className="text-xs font-bold text-[#77736B]">
                    Total Bookings: {bookings.length}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold">
                    <thead className="bg-[#FBF8F2] text-[10px] uppercase tracking-wider text-[#77736B] border-b border-[#E8DCC5]">
                      <tr>
                        <th className="p-3">Booking Reference</th>
                        <th className="p-3">Primary Attendee</th>
                        <th className="p-3">Event</th>
                        <th className="p-3">Passes</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">View</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8DCC5]/60">
                      {bookings
                        .filter(
                          (b) =>
                            !searchQuery ||
                            (b.bookingId || "")
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            b.guestName
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            b.mobile.includes(searchQuery),
                        )
                        .map((b) => (
                          <tr key={b._id} className="hover:bg-[#FBF8F2]/60">
                            <td className="p-3 font-mono font-bold text-[#3B3B3B]">
                              {b.bookingId || b._id}
                            </td>
                            <td className="p-3">
                              <p className="font-bold text-[#292929]">
                                {b.guestName}
                              </p>
                              <p className="text-[11px] text-[#77736B]">
                                {b.mobile}
                              </p>
                            </td>
                            <td className="p-3 text-[#77736B]">
                              {b.eventId?.title || "Navratri Celebration"}
                            </td>
                            <td className="p-3">
                              <span className="rounded-md bg-[#FBF8F2] px-2 py-1 text-xs font-bold text-[#3B3B3B] border border-[#E8DCC5]">
                                {b.totalTickets} passes
                              </span>
                            </td>
                            <td className="p-3 font-extrabold text-[#292929]">
                              ₹{b.finalAmount || b.totalAmount}
                            </td>
                            <td className="p-3">
                              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-800">
                                {b.paymentStatus}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => setViewBookingModal(b)}
                                className="rounded-lg p-1.5 text-[#3B3B3B] hover:bg-[#FBF8F2] hover:text-[#C9A96E]"
                                title="View Pass Details"
                              >
                                <Eye size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Users Manager Tab */}
            {section === "Users" && (
              <div className="rounded-2xl sm:rounded-3xl border border-[#E8DCC5] bg-white p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-80">
                    <Search
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77736B]"
                    />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search users by name or email..."
                      className="w-full rounded-xl border border-[#E8DCC5] bg-[#FBF8F2] pl-10 pr-4 py-2.5 text-xs font-semibold outline-none focus:border-[#C9A96E]"
                    />
                  </div>
                  <span className="text-xs font-bold text-[#77736B]">
                    Total Users: {usersList.length}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold">
                    <thead className="bg-[#FBF8F2] text-[10px] uppercase tracking-wider text-[#77736B] border-b border-[#E8DCC5]">
                      <tr>
                        <th className="p-3">Name</th>
                        <th className="p-3">Email & Mobile</th>
                        <th className="p-3">City</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Toggle Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8DCC5]/60">
                      {usersList
                        .filter(
                          (u) =>
                            !searchQuery ||
                            u.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            u.email
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()),
                        )
                        .map((u) => (
                          <tr key={u._id} className="hover:bg-[#FBF8F2]/60">
                            <td className="p-3 font-bold text-[#292929]">
                              {u.name}
                            </td>
                            <td className="p-3 text-[#77736B]">
                              <p className="text-[#292929]">{u.email}</p>
                              <p className="text-[11px] text-[#77736B]">
                                {u.phone}
                              </p>
                            </td>
                            <td className="p-3 text-[#77736B]">
                              {u.city || "—"}
                            </td>
                            <td className="p-3">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                                  u.role === "admin"
                                    ? "bg-[#E5D2A8]/30 text-[#3B3B3B] border border-[#C9A96E]"
                                    : "bg-[#FBF8F2] text-[#77736B] border border-[#E8DCC5]"
                                }`}
                              >
                                {u.role}
                              </span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                                  u.status === "active"
                                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                                    : "bg-rose-50 border border-rose-200 text-rose-800"
                                }`}
                              >
                                {u.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleToggleUserStatus(u)}
                                className="rounded-xl border border-[#E8DCC5] px-3 py-1 text-xs font-bold hover:bg-[#FBF8F2] text-[#3B3B3B]"
                              >
                                {u.status === "active"
                                  ? "Deactivate"
                                  : "Activate"}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Payments Ledger Tab */}
            {section === "Payments" && (
              <div className="rounded-2xl sm:rounded-3xl border border-[#E8DCC5] bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-[#292929]">
                    Payment Transactions
                  </h3>
                  <span className="text-xs font-bold text-[#77736B]">
                    Total Recorded: {payments.length}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold">
                    <thead className="bg-[#FBF8F2] text-[10px] uppercase tracking-wider text-[#77736B] border-b border-[#E8DCC5]">
                      <tr>
                        <th className="p-3">Razorpay Payment ID</th>
                        <th className="p-3">Booking ID</th>
                        <th className="p-3">Event</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8DCC5]/60">
                      {payments.map((p) => (
                        <tr key={p._id} className="hover:bg-[#FBF8F2]/60">
                          <td className="p-3 font-mono font-bold text-[#292929]">
                            {p.razorpayPaymentId || "Mock Gateway"}
                          </td>
                          <td className="p-3 font-mono font-bold text-[#3B3B3B]">
                            {p.bookingId || p._id}
                          </td>
                          <td className="p-3 text-[#77736B]">
                            {p.eventId?.title || "Garba Night"}
                          </td>
                          <td className="p-3 font-extrabold text-[#292929]">
                            ₹{p.finalAmount || p.totalAmount}
                          </td>
                          <td className="p-3">
                            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-800">
                              {p.paymentStatus}
                            </span>
                          </td>
                          <td className="p-3 text-[#77736B]">
                            {new Date(p.createdAt).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Add / Edit Event Modal */}
      {eventModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl sm:rounded-3xl border border-[#E8DCC5] bg-white p-6 sm:p-8 shadow-2xl my-8">
            <button
              onClick={() => setEventModalOpen(false)}
              className="absolute top-5 right-5 grid h-9 w-9 place-items-center rounded-full bg-[#FBF8F2] text-[#77736B] hover:bg-[#E8DCC5]"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl sm:text-2xl font-extrabold text-[#292929] mb-4">
              {editingEvent
                ? "Edit Navratri Event"
                : "Create New Navratri Event"}
            </h2>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="form-label">Event Title *</span>
                  <input
                    required
                    className="input-control"
                    value={eventForm.title}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, title: e.target.value })
                    }
                    placeholder="e.g. Grand Junagadh Garba Mahotsav"
                  />
                </label>

                <label className="block">
                  <span className="form-label">Category *</span>
                  <select
                    className="input-control"
                    value={eventForm.category}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, category: e.target.value })
                    }
                  >
                    <option value="Garba">Garba</option>
                    <option value="Dandiya">Dandiya</option>
                    <option value="College">College</option>
                    <option value="Traditional">Traditional</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="form-label">About / Description *</span>
                <textarea
                  required
                  rows={3}
                  className="input-control"
                  value={eventForm.about}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, about: e.target.value })
                  }
                  placeholder="Describe the celebration, artists, and features..."
                />
              </label>

              <label className="block">
                <span className="form-label">Highlights (comma separated)</span>
                <input
                  className="input-control"
                  value={eventForm.highlights}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, highlights: e.target.value })
                  }
                  placeholder="Live Dhol, Food Court, Satyam Party Plot"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="form-label">Date *</span>
                  <input
                    required
                    type="date"
                    className="input-control"
                    value={eventForm.date}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, date: e.target.value })
                    }
                  />
                </label>

                <label className="block">
                  <span className="form-label">Time *</span>
                  <input
                    required
                    className="input-control"
                    value={eventForm.time}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, time: e.target.value })
                    }
                    placeholder="7:00 PM Onwards"
                  />
                </label>

                <label className="block">
                  <span className="form-label">Duration</span>
                  <input
                    className="input-control"
                    value={eventForm.duration}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, duration: e.target.value })
                    }
                    placeholder="10 Nights"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="form-label">Venue Name *</span>
                  <input
                    required
                    className="input-control"
                    value={eventForm.venueName}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, venueName: e.target.value })
                    }
                    placeholder="Satyam Party Plot"
                  />
                </label>

                <label className="block">
                  <span className="form-label">City *</span>
                  <input
                    required
                    className="input-control"
                    value={eventForm.venueCity}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, venueCity: e.target.value })
                    }
                    placeholder="Junagadh"
                  />
                </label>

                <label className="block">
                  <span className="form-label">Organizer</span>
                  <input
                    className="input-control"
                    value={eventForm.organizer}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, organizer: e.target.value })
                    }
                    placeholder="Raghav Events Junagadh"
                  />
                </label>
              </div>

              {/* Pass Tiers Configurator */}
              <div className="border-t border-[#E8DCC5] pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9A96E]">
                    Pass Tiers & Pricing
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setEventForm({
                        ...eventForm,
                        ticketTypes: [
                          ...eventForm.ticketTypes,
                          {
                            name: "Pass",
                            price: 1499,
                            totalSeats: 500,
                            description: "",
                          },
                        ],
                      });
                    }}
                    className="text-xs font-bold text-[#3B3B3B] hover:underline"
                  >
                    + Add Pass Tier
                  </button>
                </div>

                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {eventForm.ticketTypes.map((tier, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-4 gap-2 items-center rounded-xl bg-[#FBF8F2] p-2.5 border border-[#E8DCC5]"
                    >
                      <input
                        placeholder="Tier Name (e.g. Family Pass)"
                        className="rounded-lg border border-[#E8DCC5] bg-white px-2 py-1.5 text-xs font-bold text-[#292929]"
                        value={tier.name}
                        onChange={(e) => {
                          const updated = [...eventForm.ticketTypes];
                          updated[idx].name = e.target.value;
                          setEventForm({ ...eventForm, ticketTypes: updated });
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Price (₹)"
                        className="rounded-lg border border-[#E8DCC5] bg-white px-2 py-1.5 text-xs font-bold text-[#292929]"
                        value={tier.price}
                        onChange={(e) => {
                          const updated = [...eventForm.ticketTypes];
                          updated[idx].price = Number(e.target.value);
                          setEventForm({ ...eventForm, ticketTypes: updated });
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Total Seats"
                        className="rounded-lg border border-[#E8DCC5] bg-white px-2 py-1.5 text-xs font-bold text-[#292929]"
                        value={tier.totalSeats}
                        onChange={(e) => {
                          const updated = [...eventForm.ticketTypes];
                          updated[idx].totalSeats = Number(e.target.value);
                          setEventForm({ ...eventForm, ticketTypes: updated });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = eventForm.ticketTypes.filter(
                            (_, i) => i !== idx,
                          );
                          setEventForm({ ...eventForm, ticketTypes: updated });
                        }}
                        className="text-rose-600 text-xs font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#E8DCC5]/60">
                <button
                  type="button"
                  onClick={() => setEventModalOpen(false)}
                  className="rounded-xl border border-[#E8DCC5] px-5 py-2.5 text-xs font-bold text-[#77736B] hover:bg-[#FBF8F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#3B3B3B] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#292929] shadow-xs"
                >
                  {editingEvent ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking View Modal */}
      {viewBookingModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-2xl sm:rounded-3xl border border-[#E8DCC5] bg-white p-6 sm:p-8 shadow-2xl space-y-4">
            <button
              onClick={() => setViewBookingModal(null)}
              className="absolute top-5 right-5 grid h-9 w-9 place-items-center rounded-full bg-[#FBF8F2] text-[#77736B] hover:bg-[#E8DCC5]"
            >
              <X size={18} />
            </button>

            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold uppercase text-emerald-800">
              {viewBookingModal.paymentStatus}
            </span>

            <h3 className="text-xl font-extrabold text-[#292929]">
              Booking #{viewBookingModal.bookingId || viewBookingModal._id}
            </h3>

            <div className="rounded-2xl bg-[#FBF8F2] p-4 text-xs font-semibold space-y-2 border border-[#E8DCC5]">
              <p>
                <strong className="text-[#292929]">Guest Name:</strong>{" "}
                {viewBookingModal.guestName}
              </p>
              <p>
                <strong className="text-[#292929]">Mobile:</strong>{" "}
                {viewBookingModal.mobile}
              </p>
              <p>
                <strong className="text-[#292929]">City:</strong>{" "}
                {viewBookingModal.city || "Junagadh"}
              </p>
              <p>
                <strong className="text-[#292929]">Event:</strong>{" "}
                {viewBookingModal.eventId?.title || "Garba Night"}
              </p>
              <p>
                <strong className="text-[#292929]">Razorpay ID:</strong>{" "}
                {viewBookingModal.razorpayPaymentId || "Mock"}
              </p>
              <p>
                <strong className="text-[#292929]">Total Amount:</strong> ₹
                {viewBookingModal.finalAmount || viewBookingModal.totalAmount}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-[#77736B] mb-2">
                Allocated Passes
              </h4>
              <div className="space-y-1.5">
                {(viewBookingModal.tickets || []).map((t, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#E8DCC5] bg-[#FBF8F2] p-3 text-xs font-bold"
                  >
                    <p className="text-[#292929]">
                      {t.quantity}x {t.ticketType} Pass
                    </p>
                    <p className="text-[11px] text-[#77736B] font-mono mt-0.5">
                      Seats: {t.seatNumbers?.join(", ") || "General Entry"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8DCC5]/60 flex justify-end">
              <button
                onClick={() => setViewBookingModal(null)}
                className="rounded-xl bg-[#3B3B3B] px-5 py-2 text-xs font-bold text-white hover:bg-[#292929]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminDashboard;
