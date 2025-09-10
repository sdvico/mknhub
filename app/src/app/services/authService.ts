import axios from 'axios';
import {API_URL} from '../config/constants';

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  password: string;
  fullname: string;
}

interface AuthResponse {
  token: string;
  user: {
    username: string;
    fullname: string;
  };
}

const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/api/auth/login`, data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/api/auth/register`, data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axios.post(`${API_URL}/api/auth/logout`);
  },
};

export default authService;
