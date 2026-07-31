import api from './api_services';
import {  isAdmin} from './api_services';

export async function fetchUsers(page = 1) {
  let isAdminValue = isAdmin(); 
  if(isAdminValue) {
      return api.get(`/admin/users/list?page=${page}`);
  }else {
      return api.get(`/merchant/users?page=${page}`);
  }

}

export async function storeUser(data, type) {
  let isAdminValue = isAdmin(); 
  if(isAdminValue) {
    if( type == 1) {
    return api.post('/admin/users/store', data);
    }else {
      return api.post('/admin/users/update', data);
    }
  }else {
    if( type == 1) {
      return api.post('/merchant/users/store', data);
    }else {
      return api.post('/merchant/users/update', data);
    }
  }
 
  
}

export async function updateStore(id, data) {
  return api.put(`/admin/merchants/${id}`, data);
}

export async function deleteUser(user) {
  let isAdminValue = isAdmin(); 
  if(isAdminValue) {
    return api.delete(`admin/users/delete/${user}`);
  }else{
    return api.delete(`merchant/users/delete/${user}`);
  }
}

// export async function toggleStatus(merchant_id, payload) {
//   // admin/merchants/:merchantId/toggle-active
//   return api.patch(`admin/merchants/${merchant_id}/toggle-active`,payload);
// }


