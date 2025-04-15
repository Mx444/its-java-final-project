import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/auth/';

class AuthService {
  login(email, password) {
    return axios
      .post(API_URL + 'login', { email, password })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('token', JSON.stringify(response.data.token));
        }
        return response.data;
      });
  }

  register(userData) {
    return axios.post(
      API_URL + 'register', 
      userData,
      { headers: authHeader() }
    );
  }

  logout() {
    localStorage.removeItem('token');
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;