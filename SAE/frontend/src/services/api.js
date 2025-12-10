const API_URL = 'http://localhost:8000';

export const apiCall = async (endpoint, options = {}) => {
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

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (response.status === 401) {
    localStorage.removeItem('jwt_token');
    window.location.href = '/login';
    throw new Error('Token expired');
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
  
  delete: (endpoint) => apiCall(endpoint, { method: 'DELETE' })
};

/* Exemple d'utilisation

import { api } from '../services/api';

  const fetchAnimals = async () => {
    try {
      const response = await api.get('/api/animals');
      const data = await response.json();
      setAnimals(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

*/