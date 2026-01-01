// frontend/src/api/auth.js - WITH FORMDATA SUPPORT
import api from "./axios";

export const authAPI = {
  // Register new user (supports FormData for avatar upload)
  register: async (userData) => {
    const config = {};

    // If userData is FormData, set appropriate headers
    if (userData instanceof FormData) {
      config.headers = {
        "Content-Type": "multipart/form-data",
      };
    }

    const response = await api.post("/auth/register", userData, config);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Update user profile (supports FormData for avatar upload)
  updateProfile: async (profileData) => {
    const config = {};

    // If profileData is FormData, set appropriate headers
    if (profileData instanceof FormData) {
      config.headers = {
        "Content-Type": "multipart/form-data",
      };
    }

    const response = await api.put("/auth/profile", profileData, config);
    return response.data;
  },
};
