import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/admin/';
const API_URL_PUBLIC = "http://localhost:8080/api/user/";

class AdminService {
  getAllBooks() {
    return axios.get(API_URL_PUBLIC + 'libri', { headers: authHeader() });
  }
  
  getAllLoans() {
    return axios.get(API_URL + 'prestiti', { headers: authHeader() });
  }

  getBookReports() {
    return axios.get(API_URL + 'report/libri-piu-letti', { headers: authHeader() });
  }

  addBook(book) {
    const bookData = {
      titolo: book.titolo,
      autore: book.autore,
      genere: book.genere,
      annoDiPubblicazione: Number(book.annoDiPubblicazione),
      copieDisponibili: Number(book.copieDisponibili)
    };
    
    console.log('Adding new book:', bookData);
    
    return axios.post(API_URL + 'libri', bookData, { 
      headers: {
        ...authHeader(),
        "Content-Type": "application/json"
      }
    });
  }

  updateBook(id, book) {
    const bookData = {
      titolo: book.titolo,
      autore: book.autore,
      genere: book.genere,
      annoDiPubblicazione: Number(book.annoDiPubblicazione),
      copieDisponibili: Number(book.copieDisponibili)
    };
    
    console.log('Sending to backend:', bookData);
    
    return axios.put(API_URL + `libri/${id}`, bookData, { 
      headers: {
        ...authHeader(),
        "Content-Type": "application/json"
      }
    });
  }

  deleteBook(id) {
    return axios.delete(API_URL + `libri/${id}`, { headers: authHeader() });
  }
}

const adminServiceInstance = new AdminService();
export default adminServiceInstance;