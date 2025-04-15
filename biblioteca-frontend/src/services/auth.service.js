import api from './api.interceptor';

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', JSON.stringify(response.data.token));
        return response.data;
      } else {
        console.error("Risposta di login senza token:", response.data);
        throw new Error("Errore: risposta di login non valida");
      }
    } catch (error) {
      console.error("Errore durante il login:", error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  register: async (userData) => {
    return api.post('/auth/register', userData);
  }
};

export default authService;