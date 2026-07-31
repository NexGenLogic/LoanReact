<template>
    <div class="me-selector" @click="toggleDropdown" @mouseleave="showDropdown = false">
      <a class="nav-link  d-flex align-items-center py-0" href="#" role="button"
              data-bs-toggle="dropdown" aria-expanded="false" :class="color ? color : 'text-body'">
              <i class="material-icons" :class="isRTL ? 'ms-sm-2' : 'me-sm-1'">account_circle</i>
            </a>

      
      <ul v-if="showDropdown" class="dropdown-menu-profile">
        <li   @click="goToMyProfile">
          <i class="material-icons dropdown-button" :class="isRTL ? 'ms-sm-2' : 'me-sm-1'">account_circle</i> my Profile
        </li>
        <li   @click="goLogout">
          <i class="material-icons ms-2" :class="isRTL ? 'ms-sm-2' : 'me-sm-1'">
                    logout
                  </i>
        </li>

      </ul>
    </div>
  </template>
  
  <script>

  
  export default {
    name: 'meDropdown',
    data() {
      return {
        showDropdown: false,
       
      }
    },
 
    methods: {
     
      toggleDropdown() {
        this.showDropdown = !this.showDropdown
      },
      
    }
  }
  </script>
  
  <style scoped>
  .me-selector {
    position: relative;
    display: inline-block;
    cursor: pointer;
  }
  
  .dropdown-button {
    background: transparent;
    border: none;
    font-size: 16px;
  }
  
  .dropdown-menu-profile {
    position: absolute;
    top: 30px;
    left: 0;
    background: white;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    list-style: none;
    padding: 10px 0;
    margin: 0;
    width: 170px;
    z-index: 1000;
  }
  
  .dropdown-menu-profile li {
    padding: 8px 15px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .dropdown-menu-profile li:hover {
    background-color: #f3f3f3;
  }
  
  .dropdown-menu-profile img {
    width: 20px;
    margin-right: 10px;
    border-radius: 3px;
  }
  </style>
  