<template>
    <button class="d-flex gap-2 " @click="returnToAdmin" style="    border: 1px solid #ccc;
    padding: 5px 20px;
    border-radius: 5px;" 
    >
<i class="material-icons" title="Return to Admin">undo</i>
      <span class="d-none d-lg-block">Return to Admin</span>
    </button>
  </template>
  
  <script>
  import {setToken} from  "@/utils/api_services";
  export default {
    name: 'ReturnToAdmin',
    
    methods: {
      returnToAdmin() {
        const adminToken = localStorage.getItem('impersonator_token');
        const adminUser = localStorage.getItem('impersonator_user');
        const adminPermissions = localStorage.getItem('impersonator_permissions');

        if (!adminToken || !adminUser || !adminPermissions) return;

        setToken(adminToken);
        localStorage.setItem('user', adminUser);
        localStorage.setItem('permissions', adminPermissions);

        localStorage.removeItem('impersonator_token');
        localStorage.removeItem('impersonator_user');
        localStorage.removeItem('impersonator_permissions');

        window.location.href = '/dashboard';
      }
    }
  };
  </script>
  