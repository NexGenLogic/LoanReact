import axios from 'axios';
import authHeader from './auth-header';
// import Jsona from 'jsona';

const API_URL = process.env.VUE_APP_API_BASE_URL;
// const dataFormatter = new Jsona();

export default {
  async getMainCat() {
    const response = await axios.get(API_URL + "/main-cat", { headers: authHeader() })
    
    // return dataFormatter.deserialize(response.data);
    return response.data;
  },


}