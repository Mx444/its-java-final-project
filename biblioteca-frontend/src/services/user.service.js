import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/user/";

class UserService {
  getBooks() {
    return axios.get(API_URL + "libri", { headers: authHeader() });
  }

  getMyLoans() {
    return axios.get(API_URL + "miei-prestiti", { headers: authHeader() });
  }

  borrowBook(idLibro) {
    return axios.post(
      API_URL + "prestiti",
      { idLibro: idLibro },
      { headers: authHeader(), "Content-Type": "application/json" },
    );
  }

  returnBook(loanId) {
    return axios.post(
      API_URL + `restituisci/${loanId}`,
      {},
      { headers: authHeader(), "Content-Type": "application/json" },
    );
  }
}

const userServiceInstance = new UserService();
export default userServiceInstance;
