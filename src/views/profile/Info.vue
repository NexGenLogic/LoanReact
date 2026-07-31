<template>
  <div class="multisteps-form__panel border-radius-xl bg-white" data-animation="FadeIn">
    <h5 class="font-weight-bolder mb-0">About me</h5>
    <div class="multisteps-form__content">

      <div class="row mt-4 overflow-hidden">
        <!-- <div>
          <material-avatar :img="getImage" shadow="regular" class="img-fluid w-20 mt-7" :fixedSize="true">
          </material-avatar>
        </div> -->
        <!-- <div class="mt-1  mb-2">
          <material-button v-show="!file" size="sm" type="button">
            <label for="imageInput" class="mb-0 text-white small cursor-pointer">Select Image</label>
            <input id="imageInput" type="file" style="display: none;" accept="image/*" @change.prevent="onFileChange">
          </material-button>

          <div v-show="file">
            <material-button class="mx-2" size="sm" type="button" color="danger" @click.prevent="onFileRemove">
              <label class="mb-0 text-white small cursor-pointer"> &#10005; Remove</label>
            </material-button>
            <material-button size="sm" type="button">
              <label for="imageInput" class="mb-0 text-white small cursor-pointer">Change</label>
              <input id="imageInput" type="file" style="display: none;" accept="image/*" @change.prevent="onFileChange">
            </material-button>
          </div>

        </div> -->
      </div>


      <div class="row mt-5">

        <material-input id="name" label="Name" variant="static" v-model:value="user.name" name="name" />
        <validation-error :errors="apiValidationErrors.name" />

      </div>

      <div class="row mt-5">
        <material-input id="email" type="email" label="Email Address" variant="static" v-model:value="user.email"
          name="email" />

        <validation-error :errors="apiValidationErrors.email" />
      </div>
      <div class="row mt-5">
        <material-input id="phone" type="text" label="Phone" variant="static" v-model:value="user.phone_number"
          name="phone" />

        <validation-error :errors="apiValidationErrors.email" />
      </div>

      <div class="button-row d-flex mt-4">
        <material-button type="button" color="dark" variant="gradient" class="ms-auto mb-0 js-btn-next"
          @click="handleSubmit">Submit Changes</material-button>
      </div>
    </div>
  </div>
</template>
  
<script>
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";
// import MaterialAvatar from "@/components/MaterialAvatar.vue";
import ValidationError from "@/components/ValidationError.vue";
import formMixin from "@/mixins/formMixin.js";
import showSwal from "@/mixins/showSwal.js";
import {get_user_profile, update_user_profile, isAdmin} from "@/utils/api_services";
// import _ from "lodash"

export default {
  name: "AppInfo",
  components: {
    MaterialInput,
    MaterialButton,
    // MaterialAvatar,
    ValidationError,
  },
  data() {
    return {
      user: {},
      file: null,
      imgSource: 'https://vue-material-dashboard-laravel-pro.creative-tim.com/img/placeholder.jpg',
      loading: null,
    }
  },
  mixins: [formMixin],
  // computed: {
  //   getImage() {
  //     if (!this.user.profile_image || this.loading) return require("@/assets/img/placeholder.jpg")
  //     else { return this.user.profile_image }
  //   }
  // },
  async mounted() {
    this.loading = true
    try {
      let response  = await get_user_profile();
      
      this.user= response.data.data;
      // this.user = _.omit(this.$store.getters['profile/getUserProfile'], 'links');
    } catch (error) {
      showSwal.methods.showSwal({
        type: "error",
        message: "Oops, something went wrong!",
        width: 500
      });
    } finally {
      // this.loading = false
      // this.initialImageUrl = this.getImage;
    }
    this.loading = false
  },
  methods: {
    // onFileChange(event) {
    //   this.file = event.target.files[0];
    //   this.user.profile_image = URL.createObjectURL(this.file);
    // },
    // onFileRemove() {
    //   this.file = null
    //   this.user.profile_image = this.initialImageUrl;
    // },
    async handleSubmit() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!isAdmin() && (!this.user.email || !this.user.phone_number || !this.user.name) ) {
        showSwal.methods.showSwal({
          type: "error",
          message: "Field missing!.",
          width: 500
        });
      } else if( isAdmin() && (!this.user.email  || !this.user.name) ){
          showSwal.methods.showSwal({
            type: "error",
            message: "Field missing!.",
            width: 500
          });
      }
      else if(!emailRegex.test(this.user.email)){
        showSwal.methods.showSwal({
          type: "error",
          message: "Email is not valid!.",
          width: 500
        });
      }
      else {
        this.resetApiValidation();

        try {
          // if (this.file !== null) {
          //   await this.$store.dispatch("profile/uploadPic", this.file)
          //   this.user.profile_image = this.$store.getters['profile/getUserProfileImage']
          //   this.file = null
          // }
          const formData = new FormData();
          formData.append('email', this.user.email);
          formData.append('name', this.user.name);
          formData.append('phone_number', this.user.phone_number);
          await update_user_profile(formData, this.user.id);
          // this.user = _.omit(this.$store.getters['profile/getUserProfile'], 'links');
          showSwal.methods.showSwal({
            type: "success",
            message: "Profile updated successfully!",
            width: 500
          });
        } catch (error) {
          this.setApiValidation(error.response.data.errors);
          showSwal.methods.showSwal({
            type: "error",
            message: "Oops, something went wrong!",
            width: 500
          });
        }
      }
    }
  },
};
</script>
  
