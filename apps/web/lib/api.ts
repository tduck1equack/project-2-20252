import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // For HttpOnly cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to handle automatic token refresh (if we move logic here later)
// or global error handling
api.interceptors.response.use(
    (response) => response.data, // Unwraps the response to Just data immediately? Or keeps full response?
    // User wants separation. Let's return the standard response.data for success
    // Actually, typical axios usage is `response.data`.
    // Our/Mine API returns { success: true, data: T }.
    // So returning response.data gives us access to success property.
    (error) => {
        // Handle global errors (e.g. 401 redirect)
        if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
            // Optional: Redirect to login or let the hook handle it
        }
        return Promise.reject(error);
    }
);

export default api;
