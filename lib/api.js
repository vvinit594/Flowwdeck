// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper function to get auth token
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Helper function to set auth token
export const setAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

// Helper function to remove auth token
export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }
};

// Helper function to set refresh token
export const setRefreshToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('refreshToken', token);
  }
};

// Helper function to get refresh token
const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken');
  }
  return null;
};

// Base fetch wrapper with auth
const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Try to parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      // If JSON parsing fails, throw a generic error
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    // Handle token expiration
    if (response.status === 401 && data.message?.includes('expired')) {
      // Try to refresh token
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry original request with new token
        const newToken = getAuthToken();
        config.headers.Authorization = `Bearer ${newToken}`;
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const retryData = await retryResponse.json();
        
        if (!retryResponse.ok) {
          throw new Error(retryData.message || 'API request failed');
        }
        
        return retryData;
      } else {
        // Refresh failed, redirect to login
        removeAuthToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Session expired. Please login again.');
      }
    }

    // If response is not ok, throw error with message from backend
    if (!response.ok) {
      const errorMessage = data.message || data.error || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    // Re-throw the error so it can be caught by the calling function
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  // Signup
  signup: async (email, password, fullName, userType) => {
    const response = await apiFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName, userType }),
    });
    
    if (response.success && response.data.token) {
      setAuthToken(response.data.token);
      setRefreshToken(response.data.refreshToken);
    }
    
    return response;
  },

  // Login
  login: async (email, password) => {
    const response = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data.token) {
      setAuthToken(response.data.token);
      setRefreshToken(response.data.refreshToken);
    }
    
    return response;
  },

  // Verify Email
  verifyEmail: async (token) => {
    return await apiFetch('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  // Logout
  logout: async () => {
    const refreshToken = getRefreshToken();
    try {
      await apiFetch('/api/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    } finally {
      removeAuthToken();
    }
  },
};

// Refresh access token
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      setAuthToken(data.data.token);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};

// User API calls
export const userAPI = {
  // Get current user
  getMe: async () => {
    return await apiFetch('/api/me');
  },

  // Create profile
  createProfile: async (profileData) => {
    return await apiFetch('/api/profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  },

  // Update profile
  updateProfile: async (profileData) => {
    return await apiFetch('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  },

  // Get profile by ID (public)
  getProfileById: async (id) => {
    return await apiFetch(`/api/profile/${id}`);
  },
};

// Client API calls
export const clientAPI = {
  // Create or update client profile
  createOrUpdateProfile: async (profileData) => {
    return await apiFetch('/api/client/profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  },

  // Get client profile
  getProfile: async () => {
    return await apiFetch('/api/client/profile');
  },
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Get current user from token (decode JWT)
export const getCurrentUser = () => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    // Decode JWT payload (not validating signature on client)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      userId: payload.userId,
      email: payload.email,
      userType: payload.userType,
    };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};
