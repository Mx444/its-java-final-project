import api from './api.interceptor';

const adminService = {
  getAllBooks: async () => {
    try {
      const response = await api.get('/user/libri');
      console.log("Admin books response:", response.data);
      return response;
    } catch (error) {
      console.error("Error fetching admin books:", error);
      throw error;
    }
  },
  
  addBook: async (book) => {
    try {
      const response = await api.post('/admin/libri', book);
      console.log("Add book response:", response.data);
      return response;
    } catch (error) {
      console.error("Error adding book:", error);
      throw error;
    }
  },
  
  updateBook: async (id, book) => {
    return api.put(`/admin/libri/${id}`, book);
  },
  
  deleteBook: async (id) => {
    return api.delete(`/admin/libri/${id}`);
  },
  
  getAllLoans: async () => {
    return api.get('/admin/prestiti');
  },
  
  // Aggiungi funzioni per report e registrazione
  getBookReports: async () => {
    return api.get('/admin/report/libri-piu-letti/');
  },
  
  registerUser: async (userData) => {
    return api.post('/admin/register', userData);
  }
};

export default adminService;