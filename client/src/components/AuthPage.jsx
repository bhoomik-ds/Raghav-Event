import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  UserRound,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AuthPage = ({ mode = "signin" }) => {
  const isSignUp = mode === "signup";
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "Junagadh",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const setField = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (isSignUp) {
      if (!/^\+?[0-9\s-]{10,15}$/.test(form.phone.trim())) {
        setError("Please enter a valid 10-digit mobile number");
        return;
      }
      if (form.password.length < 8) {
        setError("Password must be at least 8 characters long");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    setSaving(true);
    try {
      if (isSignUp) {
        await signUp(form);
      } else {
        await signIn({ email: form.email, password: form.password });
      }

      const redirectTo = location.state?.from || "/my-tickets";
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Authentication failed. Please check your details and try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#FBF8F2] px-4 py-10 sm:py-16 flex items-center justify-center">
      <div className="mx-auto grid max-w-4xl w-full overflow-hidden rounded-xl border border-[#E8DCC5] bg-white shadow-sm md:grid-cols-[.9fr_1.1fr]">
        
        {/* Left Info Banner */}
        <div className="hidden bg-[#292929] p-8 sm:p-10 text-white md:flex flex-col justify-between border-r border-[#3B3B3B]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A96E]/40 bg-[#3B3B3B] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#E5D2A8]">
              <span>Raghav Events</span>
            </div>
            <h1 className="mt-8 text-3xl font-extrabold leading-tight tracking-tight text-white">
              Junagadh Navratri 2026
            </h1>
            <p className="mt-3 text-xs text-[#E5D2A8] font-medium leading-relaxed">
              Satyam Party Plot, Zanzarda Chokdi (11-20 October). Instant verified QR e-tickets.
            </p>
          </div>

          <div className="space-y-2 border-t border-white/10 pt-5 text-xs text-white/80 font-medium">
            <p className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-[#C9A96E]" /> Official Festival Platform
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-[#C9A96E]" /> Genuine Venue Wristbands
            </p>
          </div>
        </div>

        {/* Right Form Container */}
        <div className="p-6 sm:p-10">
          
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#292929]">
              {isSignUp ? "Create Festival Account" : "Sign In to Your Account"}
            </h2>
            <p className="mt-1 text-xs text-[#77736B]">
              {isSignUp
                ? "Sign up to book and manage your Junagadh Garba passes"
                : "Sign in to access your booked passes and reservations"}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-800">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-3.5">
            {isSignUp && (
              <label className="block">
                <span className="form-label">Full Name</span>
                <div className="form-field">
                  <UserRound size={15} className="text-[#77736B]" />
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={setField}
                    placeholder="Full name"
                  />
                </div>
              </label>
            )}

            <label className="block">
              <span className="form-label">Email Address</span>
              <div className="form-field">
                <Mail size={15} className="text-[#77736B]" />
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={setField}
                  placeholder="name@example.com"
                />
              </div>
            </label>

            {isSignUp && (
              <div className="grid gap-3.5 sm:grid-cols-2">
                <label className="block">
                  <span className="form-label">Mobile Number</span>
                  <div className="form-field">
                    <Phone size={15} className="text-[#77736B]" />
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={setField}
                      placeholder="10-digit mobile"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="form-label">City</span>
                  <div className="form-field">
                    <MapPin size={15} className="text-[#77736B]" />
                    <input
                      required
                      name="city"
                      value={form.city}
                      onChange={setField}
                      placeholder="Junagadh"
                    />
                  </div>
                </label>
              </div>
            )}

            <label className="block">
              <span className="form-label">Password</span>
              <div className="form-field">
                <LockKeyhole size={15} className="text-[#77736B]" />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={setField}
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#77736B] hover:text-[#292929]"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>

            {isSignUp && (
              <label className="block">
                <span className="form-label">Confirm Password</span>
                <div className="form-field">
                  <LockKeyhole size={15} className="text-[#77736B]" />
                  <input
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={setField}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-[#77736B] hover:text-[#292929]"
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </label>
            )}

            <button
              type="submit"
              disabled={saving}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#3B3B3B] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#242424] transition active:scale-95 disabled:opacity-50"
            >
              <span>{saving ? "Authenticating..." : isSignUp ? "Create Account" : "Sign In"}</span>
              <ArrowRight size={14} className="text-[#E5D2A8]" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs font-medium text-[#77736B]">
            {isSignUp ? (
              <p>
                Already have an account?{" "}
                <Link to="/signin" className="font-bold text-[#3B3B3B] hover:text-[#C9A96E] underline">
                  Sign In
                </Link>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="font-bold text-[#3B3B3B] hover:text-[#C9A96E] underline">
                  Create Account
                </Link>
              </p>
            )}
          </div>

        </div>
      </div>
    </main>
  );
};

export default AuthPage;
