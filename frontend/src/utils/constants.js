// API Base URL
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

// File upload limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

// Blog content limits
export const MIN_TITLE_LENGTH = 5;
export const MAX_TITLE_LENGTH = 200;
export const MIN_CONTENT_LENGTH = 20;

// Comment limits
export const MIN_COMMENT_LENGTH = 1;
export const MAX_COMMENT_LENGTH = 500;

// User bio limits
export const MAX_BIO_LENGTH = 200;

// Routes
export const ROUTES = {
  LANDING: "/",
  HOME: "/home",
  BLOG: "/blog",
  CREATE_BLOG: "/create",
  EDIT_BLOG: "/edit",
  ANALYTICS: "/analytics",
  PROFILE: "/profile",
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
};
