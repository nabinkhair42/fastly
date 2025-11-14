/**
 * Axios Configuration
 * Central HTTP client setup with interceptors
 */

import axios from "axios";
import {
  setupRequestInterceptor,
  setupResponseInterceptor,
} from "./interceptors";
import { tokenManager } from "./token-manager";

// Create axios instance
const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Setup interceptors
setupRequestInterceptor(api);
setupResponseInterceptor(api);

// Export token manager for use in other parts of the app
export { tokenManager };

export default api;
