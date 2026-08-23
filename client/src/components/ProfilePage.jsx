import React, { useState, useEffect } from "react";
import { User, Phone, MapPin, Mail, ShieldCheck, Ticket, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user, updateProfile, api, showToast } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    city: user?.city || "",
  });
  const [saving, setSaving] = useState(false);
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        city: user.city || "",
      });
    }

    api
      .get("api/my-bookings")
      .then((res) => {
        setBookingCount(res.data?.length || 0);
      })
      .catch(() => {});
  }, [user, api]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      showToast("Full name cannot be empty", "warning");
      return;
    }
    if (!/^\+?[0-9\s-]{10,15}$/.test(form.phone.trim())) {
      showToast("Please enter a valid 10-digit mobile number", "warning");
      return;
    }

    setSaving(true);
    try {
      await updateProfile(form);
    } catch {
      // toast shown in context
    } finally {
      setSaving(false);
    }
  };

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "Navratri Season 2026";

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#FBF8F2] px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        
        {/* Profile Card */}
        <div className="rounded-xl border border-[#E8DCC5] bg-white p-6 sm:p-8 shadow-xs">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DCC5] pb-6">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-[#3B3B3B] text-lg font-bold text-white shadow-xs">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-extrabold text-[#292929]">{user?.name}</h1>
                  {user?.role === "admin" && (
                    <span className="inline-flex items-center gap-1 rounded bg-[#FBF8F2] border border-[#C9A96E] px-2 py-0.5 text-[10px] font-bold uppercase text-[#3B3B3B]">
                      <ShieldCheck size={11} className="text-[#C9A96E]" /> Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#77736B]">Member since {joinedDate}</p>
              </div>
            </div>

            <Link
              to="/my-tickets"
              className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-[#FBF8F2] border border-[#E8DCC5] px-3.5 py-2 text-xs font-semibold text-[#3B3B3B] hover:bg-[#E8DCC5]/40 transition"
            >
              <Ticket size={13} className="text-[#C9A96E]" />
              <span>{bookingCount} Bookings</span>
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#77736B] mb-3">
              Account Details
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="form-label">Full Name</span>
                <div className="form-field">
                  <User size={15} className="text-[#77736B]" />
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your Name"
                  />
                </div>
              </label>

              <label className="block">
                <span className="form-label">Email Address (Read-only)</span>
                <div className="form-field bg-[#FBF8F2] opacity-75 cursor-not-allowed">
                  <Mail size={15} className="text-[#77736B]" />
                  <input
                    disabled
                    type="email"
                    value={user?.email || ""}
                    className="cursor-not-allowed text-[#77736B]"
                  />
                </div>
              </label>

              <label className="block">
                <span className="form-label">Mobile Number</span>
                <div className="form-field">
                  <Phone size={15} className="text-[#77736B]" />
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="10-digit mobile"
                  />
                </div>
              </label>

              <label className="block">
                <span className="form-label">City</span>
                <div className="form-field">
                  <MapPin size={15} className="text-[#77736B]" />
                  <input
                    name="city"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Junagadh"
                  />
                </div>
              </label>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#3B3B3B] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#242424] transition active:scale-95 disabled:opacity-50"
              >
                <Save size={13} className="text-[#E5D2A8]" />
                <span>{saving ? "Saving..." : "Save Profile"}</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
