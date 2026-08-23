const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getToken = (req) => {
  if (req.cookies?.accessToken) {
    return req.cookies.accessToken;
  }
  const authHeader = req.headers.authorization || req.headers.Authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7).trim();
  }
  return null;
};

const authenticateUser = async (req, res, next) => {
  try {
    const token = getToken(req);
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const secret = process.env.JWT_SECRET || "navratri-jwt-secret-key-2026";
    const payload = jwt.verify(token, secret);
    const user = await User.findById(payload.sub).select("-passwordHash");
    if (!user || user.status !== "active") {
      return res.status(401).json({ message: "Account is inactive or not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired session. Please sign in again." });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Administrator access required" });
  }
  next();
};

const optionalAuthenticate = async (req, res, next) => {
  try {
    const token = getToken(req);
    if (token) {
      const secret = process.env.JWT_SECRET || "navratri-jwt-secret-key-2026";
      const payload = jwt.verify(token, secret);
      const user = await User.findById(payload.sub).select("-passwordHash");
      if (user && user.status === "active") {
        req.user = user;
      }
    }
  } catch {
    req.user = undefined;
  }
  next();
};

module.exports = { authenticateUser, optionalAuthenticate, requireAdmin, getToken };
