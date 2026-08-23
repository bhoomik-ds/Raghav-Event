/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import { ToastContainer } from "../components/Toast";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/";
const sanitizeUrl = (url) => (url.endsWith("/") ? url : `${url}/`);
const API_URL = sanitizeUrl(API_BASE);
const TOKEN_KEY = "raghav_events_token";
const LEGACY_TOKEN_KEY = "navratri_token";

const getStoredToken = () =>
  localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);

const saveToken = (token) => {
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
};

const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
};

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request interceptor to attach bearer token if present
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", title = "") => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, type, title }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get("api/auth/me");
      if (data.user) {
        setUser(data.user);
        return data.user;
      }
      setUser(null);
      return null;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const signIn = async (credentials) => {
    try {
      const { data } = await api.post("api/auth/login", credentials);
      if (data.token) {
        saveToken(data.token);
      }
      setUser(data.user);
      showToast(
        `Welcome back, ${data.user.name.split(" ")[0]}!`,
        "success",
        "Signed In",
      );
      return data.user;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Invalid credentials. Please check your email and password.";
      showToast(msg, "error", "Sign In Failed");
      throw error;
    }
  };

  const signUp = async (details) => {
    try {
      const { data } = await api.post("api/auth/register", details);
      if (data.token) {
        saveToken(data.token);
      }
      setUser(data.user);
      showToast(
        "Your account has been created successfully!",
        "success",
        "Welcome to Raghav Events",
      );
      return data.user;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Unable to create account. Please check your details.";
      showToast(msg, "error", "Registration Failed");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await api.post("api/auth/logout");
    } catch {
      // Ignore logout network errors
    } finally {
      clearStoredToken();
      setUser(null);
      showToast("You have been signed out.", "info", "Signed Out");
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.put("api/auth/profile", profileData);
      setUser(data.user);
      showToast(
        "Your profile changes were saved successfully.",
        "success",
        "Profile Updated",
      );
      return data.user;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update profile";
      showToast(msg, "error", "Update Error");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshUser,
        api,
        showToast,
        apiUrl: API_URL,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { api };
