<template>
    <div class="multisteps-form__panel border-radius-xl bg-white" data-animation="FadeIn">
      <h5 class="font-weight-bolder mb-0">Change Password</h5>
      <div class="multisteps-form__content mt-4">
        <div class="row">
          <div class="col-12">
            <div class="mt-2">
              <material-input id="password" v-model:value="user.password" type="password" label="Password"
                name="password" />
  
              <div class="text-danger">{{ password_error }}</div>
            </div>
            <div class="mt-5">
              <material-input id="confirmPassword" v-model:value="user.password_confirmation" type="password"
                label="Confirm Password" name="confirmPassword" />
              <div class="text-danger">{{ conf_password_error }}</div>
            </div>
          </div>
        </div>
        <div class="button-row d-flex mt-4">
          <material-button type="button" color="dark" variant="gradient" class="ms-auto mb-0 js-btn-next"
            @click="handleChange">Change Password</material-button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import MaterialButton from "@/components/MaterialButton.vue";
  import MaterialInput from "@/components/MaterialInput.vue";
  // import ValidationError from "@/components/ValidationError.vue";
  import formMixin from "@/mixins/formMixin.js";
  import showSwal from "@/mixins/showSwal.js";
  import {update_password} from "@/utils/api_services";

  export default {
    name: "AppPassword",
    components: {
      MaterialButton,
      MaterialInput,
      // ValidationError
    },
    data() {
      return {
        user: {
        password: "",
        password_confirmation: "",
        
        },
        password_error  : "",
        conf_password_error : ""
      }
    },
    mixins: [formMixin],
    methods: {
      async handleChange() {
        if(!this.user.password) {
          this.password_error = "No Password Entered";
          return false;
        }
        if(!this.user.password_confirmation) {
          this.conf_password_error = "No Confirm Password Entered";
          return false;
        }
        if(this.user.password != this.user.password_confirmation) {
          this.conf_password_error = "Passwords does not match";
          return false;
        }
        try {
          this.password_error = this.conf_password_error = "";
          const formData = new FormData();
          let user = JSON.parse(localStorage.getItem('user')) || {};
          formData.append('password', this.user.password);
          formData.append('password_confirmation', this.user.password_confirmation);
          await update_password(formData, user ? user.id: '');
          showSwal.methods.showSwal({
            type: "success",
            message: "Password updated successfully!",
            width: 500
          });
          this.user.password = this.user.password_confirmation = ''
        } catch (error) {
          
          showSwal.methods.showSwal({
            type: "error",
            message: "Oops, something went wrong!",
            width: 500
          });
        }
      }
    }
  };
  </script>
  
  
  