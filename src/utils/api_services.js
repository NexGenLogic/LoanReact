import axios from 'axios';

const API_URL = process.env.VUE_APP_API_BASE_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Set token
export function setToken(token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  localStorage.setItem('access_token', token);
}

// Clear token
export function clearToken() {
  delete api.defaults.headers.common['Authorization'];
  localStorage.removeItem('access_token');
  localStorage.removeItem('permissions');
  localStorage.removeItem('user');
  localStorage.removeItem('superadmin');
  localStorage.removeItem('admin');
  localStorage.removeItem('impersonator_token');
  localStorage.removeItem('impersonator_user');
  localStorage.removeItem('impersonator_permissions');
  
}

// Interceptor
api.interceptors.response.use(
  response => {
    
    return response;
  },
  error => {
    if (error.response) {
        const status = error.response.status;
         const message = error.response?.data?.message;
        
        if (status === 401 && message == 'Unauthenticated.') {
          
            clearToken();
            localStorage.removeItem('access_token');
           
        }

        if (status === 422 && error.response.data.errors) {
            const errors = error.response.data.errors;

            // Loop through and build HTML string
            let html = '';
            for (const field in errors) {
            if (Array.isArray(errors[field])) {
                errors[field].forEach(message => {
                html += `<div style="color: red;">${message}</div>`;
                });
            }
            }

            // Return validation errors in a special format
            return Promise.reject({ type: 'validation', html, raw: error });
        }
        if (status === 500 ) {
            console.log(error)
            let html = `<div style="color: red;">${error.message}</div>`;
            return Promise.reject({ type: 'validation', html, raw: error });
        }
    }

    return Promise.reject(error);
  }
);

// Other API functions
export async function register(formData) {
  try {
    const response = await api.post('/admin/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

export async function login(email, password,url) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    try {
    const response = await api.post(url, formData);
    console.log(response)
    const token = response.data.misc.auth.access_token;
    const userData = response.data.data;
    const permissions = response.data.misc.permissions;
    const is_superAdmin = response.data.data.is_super_admin ? true : false;
    const fullAccess = response.data.misc.permissions.full_access ? true : false;
    if(is_superAdmin === true) {
       localStorage.setItem('superadmin', is_superAdmin);
    }else if(fullAccess) {
      localStorage.setItem('admin', true); //regular admin only has full access
    }
   
    if (token) {
      setToken(token);
    }
    if(permissions) {
      localStorage.setItem('permissions', JSON.stringify(permissions));
    }
    if(userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  
    return response.data;
} catch (error) {
    
    throw error.response ? error.response.data : error;
  }
  }
  
  export async function logout() {
    try {
      await api.post('/admin/auth/logout', {});
    } catch (err) {
      // Optional: handle error
    } finally {
      clearToken(); // <-- Clears Axios headers and localStorage
      window.location.href = '/login'; // Optional redirect after logout
    }
  }
  // Other example API
  export async function getUserProfile() {
    return await api.get('/admin/profile');
  }
  export function isImpersonate()
  {
    const impersonate_token = localStorage.getItem('impersonator_token');
    if(impersonate_token) {
      return true;
    }else {
      return false;
    }
  }
  export function isAdmin()
  {
    
    let user = localStorage.getItem('user');
    user = JSON.parse(user);
    if(user.role_id == '1'){
      return true;
    }else {
      return false;
    }
  }
  export function isImpersonated()
  {
    return  !!localStorage.getItem('impersonator_token');
  }
  export function is_allowed(module, permission = 'read') {

    const isSuperAdmin = localStorage.getItem('superadmin') === 'true';
    const isAdmin = localStorage.getItem('admin') === 'true';
    const isImpersonating = !!localStorage.getItem('impersonator_token');
    if(module === "vendors" || module === 'permissions'){
      if (isSuperAdmin ) {
        return true;
      }
      return false;
    }
    if (isSuperAdmin || isAdmin) {

      if (isImpersonating && (module === 'merchants')) {
        return false;
      }
      // Superadmin doesn't have access to 'branch' when impersonating
      if (!isImpersonating && (module === 'merchant_branches' ||  module === 'sales')) return false;
      return true;
    }
  
    const permissions = localStorage.getItem('permissions');
    if (!permissions) return false;
  
    try {
      const parsed = JSON.parse(permissions);
      return parsed[module]?.[permission] === true;
    } catch (e) {
      console.error('Invalid permissions JSON', e);
      return false;
    }
  }
  

  export async function get_user_profile() {
   
    let userIsAdmin = isAdmin();
  
    if(userIsAdmin) {
      return await api.get('/admin/auth/me');
    }else {
      return await api.get('/admin/auth/me');
    }
    
  }

  export async function update_user_profile(payload, id) {
      let userIsAdmin = isAdmin();
      if(userIsAdmin) {
        return await api.post('/admin/users/profile/update',payload);
      }else {
        return await api.post('/admin/users/profile/'+id,payload);
      }

  }

  export async function update_password(payload, user) {
    let userIsAdmin = isAdmin();
    if(userIsAdmin) {
      return await api.post('/admin/users/password', payload);
    }else {
      return await api.post('/admin/users/password/'+user, payload);
    }

  }


  export async function fetchWalletBalance()
  {
    return api.get("/admin/wallet/balance");
  }

  export async function fetchEdfaRedirect(payload)
  {
    return api.post("/admin/wallet/recharge/process", payload);
  }

  export async function getNotifications() {
    return api.get('/admin/notifications');
  }

  export async function markNotificationsAsRead() {
    return api.post('/admin/notifications/mark-as-read');
  }

  export function getUserRole() {
    const user = localStorage.getItem('user');
    if (!user) return null;

    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.role.name; // or parsedUser.role_name based on your data
    } catch {
      return null;
    }
  }
export default api;
