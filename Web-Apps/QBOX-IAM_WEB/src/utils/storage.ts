
const STORAGE_KEY = 'user';

const storage = {
  setToken: (token: string) => {
    localStorage.setItem(STORAGE_KEY, token);
  },

  getToken: () => {
    return localStorage.getItem(STORAGE_KEY);
  },

  removeToken: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  isAuthenticated: () => {
    let data: any = localStorage.getItem(STORAGE_KEY);
    let token = JSON.parse(data);
    let isAuthenticated = token !== null && token !== '' && token.isLoginSuccess;
    console.log(isAuthenticated)
    console.log(data)
    return isAuthenticated;
  },
};

export default storage;
