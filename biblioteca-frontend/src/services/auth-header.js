export default function authHeader() {
  try {
    const token = localStorage.getItem('token');
  
    if (token) {
      const tokenStr = typeof token === 'string' ? token.replace(/"/g, '') : token;
      return { Authorization: `Bearer ${tokenStr}` };
    }
  } catch (error) {
    console.error("Errore nella generazione dell'header di autenticazione:", error);
  }
  
  return {};
}