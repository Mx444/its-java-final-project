import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/admin/';

class AdminService {
  getAllBooks() {
    return axios.get(API_URL + 'libri', { headers: authHeader() });
  }
  
  getAllLoans() {
    return axios.get(API_URL + 'prestiti', { headers: authHeader() });
  }

  getBookReports() {
    return axios.get(API_URL + 'report/libri-piu-letti', { headers: authHeader() });
  }

  addBook(book) {
    return axios.post(API_URL + 'libri', book, { headers: authHeader() });
  }

  updateBook(id, book) {
    return axios.put(API_URL + `libri/${id}`, book, { headers: authHeader() });
  }

  deleteBook(id) {
    return axios.delete(API_URL + `libri/${id}`, { headers: authHeader() });
  }
}

const adminServiceInstance = new AdminService();
export default adminServiceInstance;