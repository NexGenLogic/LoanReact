import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.VUE_APP_API_BASE_URL
const BASE_URL = process.env.VUE_APP_BASE_URL

export default {

  async login(user) {
    var response = await axios.post(API_URL + '/merchant/auth/login', {
      email: user.email,
      password: user.password
    }, 
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    if (response.data.access_token) {
      localStorage.setItem('access_token', JSON.stringify(response.data.access_token));
    }
    return response.data;
  },

  async logout() {
    await axios.post(API_URL + "/merchant/auth/logout", {}, { headers: authHeader() })
    
    localStorage.removeItem('access_token');
  },

  async register(payload) {
    var response = await axios.post(API_URL + '/merchant/register',
      payload,
       {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
      );
    if (response.data.access_token) {
      localStorage.setItem('access_token', JSON.stringify(response.data.access_token));
    }
    return response.data;
  },

  async passwordForgot(userEmail) {

    var response = await axios.post(API_URL + '/password-forgot', {
      redirect_url: BASE_URL + "/password-reset",
      email: userEmail
    })
    return response.status;
  },

  async passwordReset(passwordDTO) {

    var response = await axios.post(API_URL + '/password-reset', {
      password: passwordDTO.newPassword,
      password_confirmation: passwordDTO.confirmPassword,
      email: passwordDTO.email,
      token: passwordDTO.token
    })
    return response.status;
  }
}