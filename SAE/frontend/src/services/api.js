const API_BASE_URL = "http://localhost:8000/api";

export const apiCall = async (endpoint, options = {}, retryCount = 0) => {
  const token = localStorage.getItem('jwt_token');

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    }
  };

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    if (token && retryCount < 1) {
      console.warn("Token expiré ou invalide sur endpoint public potentiel, nouvelle tentative sans token.");
      localStorage.removeItem('jwt_token');
      // On réessaie une seule fois sans le token
      return apiCall(endpoint, options, retryCount + 1);
    }

    localStorage.removeItem('jwt_token');
    window.location.href = '/connection';
    throw new Error('Token expired or Unauthorized');
  }

  return response;
};

export const api = {
  get: (endpoint) => apiCall(endpoint, { method: 'GET' }),

  post: (endpoint, data) => apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  put: (endpoint, data) => apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  patch: (endpoint, data) => apiCall(endpoint, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/merge-patch+json'
    },
    body: JSON.stringify(data)
  }),

  delete: (endpoint) => apiCall(endpoint, { method: 'DELETE' }),

  isLoggedIn: () => !!localStorage.getItem('jwt_token'),

  getCurrentUser: async () => {
    const response = await api.get('/me');
    return response.json();
  },

  getUserId: async () => {
    const storedId = localStorage.getItem('userId');
    if (storedId) return storedId;

    // Fetch from API
    try {
      const user = await api.getCurrentUser();
      if (user && user.id) {
        localStorage.setItem('userId', user.id);
        return user.id;
      }
    } catch (e) {
      console.error("Failed to fetch user ID", e);
    }
    return null;
  },

  getFavorites: async () => {
    const response = await api.get('/me/favorites');
    return response.json();
  },

  getMyFullFavorites: async () => {
    const response = await api.get('/me/favorites/full');
    return response.json();
  },

  addFavorite: (animalId) => api.post(`/me/favorites/animal/${animalId}`),

  removeFavorite: (animalId) => api.delete(`/me/favorites/animal/${animalId}`),

  getFavoriteArticles: async () => {
    const response = await api.get('/me/favorites/articles');
    return response.json();
  },

  getMyFullFavoriteArticles: async () => {
    const response = await api.get('/me/favorites/articles/full');
    return response.json();
  },

  addFavoriteArticle: (articleId) => api.post(`/me/favorites/article/${articleId}`),

  removeFavoriteArticle: (articleId) => api.delete(`/me/favorites/article/${articleId}`)
};