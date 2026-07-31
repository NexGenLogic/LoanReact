<template>
  
      
      <AppFormNew role="form" :validation-schema="schema" @submit="handleSubmit" :initial-values="form" class="p-4">
        <div class="multisteps-form__panel border-radius-xl " style="max-width: 900px;" data-animation="FadeIn">
          <div class="multisteps-form__content">

            <div class="accordion mb-4">
              <!-- Investor Details Accordion -->
              <div class="accordion-item border-0 shadow-sm">
                <h5 class="accordion-header bg-gradient-success d-flex justify-content-between align-items-center py-3 px-2 bg-light rounded-top"
                    :class="{'accordion-open': accordion.investorDetails}"
                    @click="toggleAccordion('investorDetails')"
                    style="cursor:pointer;">
                  <span>
                    <i class="material-icons align-middle me-2" style="vertical-align:middle;">account_circle</i>
                    Investor Details
                  </span>
                 
                </h5>
                
                  <div class="accordion-content bg-white px-3 py-3" >
                    <div class="grid-form">
                      <div>
                        <Field name="user.name" v-slot="{ field, errors, meta }">
                          <material-input id="name" label="Name" variant="static"
                            v-bind="field" :value="field.value"
                            :success="meta.valid && meta.touched"
                            :error="errors.length > 0" />
                          <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                        </Field>
                      </div>
                      <div>
                        <Field name="user.email" v-slot="{ field, errors, meta }">
                          <material-input id="email" type="email" label="Email Address" variant="static"
                            v-bind="field" :value="field.value"
                            :success="meta.valid && meta.touched"
                            :error="errors.length > 0" />
                          <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                        </Field>
                      </div>

                      <div class="position-relative">
                        <Field name="user.password" v-slot="{ field, errors, meta }">
                          <material-input
                            id="password"
                            :type="isPasswordVisible ? 'text' : 'password'"
                            label="Password (min 8 characters)"
                            variant="static"
                            v-bind="field"
                            :value="field.value"
                            :success="meta.valid && meta.touched"
                            :error="errors.length > 0"
                          />
                          <span
                            class="material-icons position-absolute"
                            @click="togglePasswordVisibility"
                            style="right: 8px; top: 50%; transform: translateY(-50%); cursor: pointer;"
                          >
                            {{ isPasswordVisible ? 'visibility_off' : 'visibility' }}
                          </span>
                          <div v-if="errors.length" class="text-danger text-sm mt-1">
                            {{ errors[0] }}
                          </div>
                        </Field>
                      </div>
                      <div>
                        <Field name="user.phone" v-slot="{ field, errors, meta }">
                          <material-input id="phone" type="text" label="Phone" variant="static"
                            v-bind="field" :value="field.value"
                            :success="meta.valid && meta.touched"
                            :error="errors.length > 0" />
                          <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                        </Field>
                      </div>
                      <div>
                        <Field name="user.address_line1" v-slot="{ field, errors, meta }">
                          <material-input id="address_line1" type="text" label="Address Line 1" variant="static"
                            v-bind="field" :value="field.value"
                            :success="meta.valid && meta.touched"
                            :error="errors.length > 0" />
                          <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                        </Field>
                      </div>

                      <div>
                        <Field name="user.address_line2" v-slot="{ field, errors, meta }">
                          <material-input id="address_line2" type="text" label="Address Line 2" variant="static"
                            v-bind="field" :value="field.value"
                            :success="meta.valid && meta.touched"
                            :error="errors.length > 0" />
                          <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                        </Field>
                      </div>
                      <div>
                        <Field name="user.city" v-slot="{ field, errors, meta }">
                          <material-input id="city" type="text" label="City" variant="static"
                            v-bind="field" :value="field.value"
                            :success="meta.valid && meta.touched"
                            :error="errors.length > 0" />
                          <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                        </Field>
                      </div>

                      <div>
                        <Field name="user.state" v-slot="{ field, errors, meta }">
                          <material-input id="state" type="text" label="State" variant="static"
                            v-bind="field" :value="field.value"
                            :success="meta.valid && meta.touched"
                            :error="errors.length > 0" />
                          <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                        </Field>
                      </div>
                      <div>
                        <Field name="user.postal_code" v-slot="{ field, errors, meta }">
                          <material-input id="postal_code" type="text" label="Postal Code" variant="static"
                            v-bind="field" :value="field.value"
                            :success="meta.valid && meta.touched"
                            :error="errors.length > 0" />
                          <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                        </Field>
                      </div>

                      <div>
                        <Field name="user.country" v-slot="{ value, handleChange, errors, meta }">
                          <CountrySelect :modelValue="value" @update:modelValue="onCountryChange($event, handleChange)"
                            id="country" name="country_select_component"
                            :class="[
                              
                              { 'is-invalid': errors.length > 0 && meta.touched, 'is-valid': meta.valid && meta.touched && !errors.length }
                            ]" />
                          <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                        </Field>
                      </div>
                      <div>
                        <label for="imageUpload" class="upload-label d-flex align-items-center gap-2 cursor-pointer bg-light rounded py-2 px-3">
                          <i class="material-icons">cloud_upload</i>
                          <span class="fw-medium">Upload Image</span>
                          <input type="file" id="imageUpload" accept="image/*" @change="handleimageUpload" hidden />
                        </label>
                        <div v-if="previewImage" class="image-preview-wrapper position-relative mt-2">
                          <img :src="previewImage" class="preview-image" alt="Preview" />
                          <button class="remove-image-btn" type="button" @click="removeImage">×</button>
                        </div>
                      </div>
                    </div>
                  </div>
                
              </div>
              <!-- Investor Documents Accordion -->
              <div class="accordion-item border-0 shadow-sm mt-2">
                <h5 class="accordion-header bg-gradient-success d-flex justify-content-between align-items-center py-3 px-2 bg-light rounded-top"
                    :class="{'accordion-open': accordion.investorDocuments}"
                    @click="toggleAccordion('investorDocuments')"
                    style="cursor:pointer;">
                  <span>
                    <i class="material-icons align-middle me-2" style="vertical-align:middle;">description</i>
                    Investor Documents
                  </span>
                  
                </h5>
                
                  <div class="accordion-content bg-white px-3 py-3">
                    <div class="row">
                      <InvestorDocuments ref="investorDocsComponent" />
                    </div>
                  </div>
                
              </div>
            </div>

            <div class="text-danger text-sm mb-3" v-html="error_msg"></div>
            <div class="button-row d-flex mt-3 justify-content-end">
              <material-button type="submit" color="dark" variant="gradient" class="px-4 py-2">
                <span v-if="!loading">{{ $t('message.save') }}</span>
                <PulseLoader v-if="loading" text="Saving" />
              </material-button>
            </div>
          </div>
        </div>
      </AppFormNew>
    
    <OffCanvas :toggle="toggleOffCanvasMenu" :class="[showOffCanvas ? 'show' : '', hideConfigButton ? 'd-none' : '']"
      :closable="true" :title="'Add User' " :id="'add_user'" />

</template>

<script>
import { Form as AppFormNew, Field } from "vee-validate"; // Import Field
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import CountrySelect from "@/views/components/CountrySelect.vue";
import * as Yup from 'yup';
import { createInvestor } from "@/utils/investor_services";
import showSwal from "@/mixins/showSwal.js";
import PulseLoader from "../PulseLoader.vue";
// import EditViewInvestorComponent from "../Investors/EditViewInvestorComponent.vue";
import {  mapMutations, mapState } from "vuex";
import OffCanvas from "@/components/OffCanvas.vue";
import InvestorDocuments from './InvestorDocuments.vue'

export default {
    name: "ViewCreateEditInvestorComponent",
    components: {
        MaterialInput,
        MaterialButton,
        AppFormNew,
        Field,
        CountrySelect,
        PulseLoader,
        // EditViewInvestorComponent,
        OffCanvas,
        InvestorDocuments
    },
    props: {
        scrollable: {
            type: Boolean,
            default: false,
        },
        sidebar: {
            type: Boolean,
            default: false,
        },
        need_title: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            accordion: {
                investorDetails: true,
                investorDocuments: false
            },
            isPasswordVisible: false,
            selectedUser: null,
            users: [],
            error_msg: "",
            previewImage: null,
            selectedImage: null,
            loading: false,
            form: {
                user: {
                    name: '',
                    // contact_person: '', // This was in your data but not form/schema
                    email: '',
                    phone: '',
                    website: '',
                    image: '',
                    state: '',
                    city: '',
                    country: '',
                    address_line1: '',
                    address_line2: '',
                    postal_code: '',
                    password: '', // <--- ADDED
                },
            },
            schema: Yup.object({
                user: Yup.object({
                    name: Yup.string().required("Name is a required input"),
                    email: Yup.string().email("Invalid email.").required("Email is required."),
                    phone: Yup.string().required("Phone is a required input"),
                    password: Yup.string().min(8, "Password must be at least 8 characters.").required("Password is required."),
                    address_line1: Yup.string().notRequired("Address is required."),
                    city: Yup.string().notRequired("City is a required input"),
                    state: Yup.string().notRequired("State is a required input"),
                    country: Yup.string().notRequired("Country is a required input"),
                    postal_code: Yup.string().notRequired("Postal code is a required input"),
                }),
            }),
        };
    },
    methods: {
          togglePasswordVisibility() {
              this.isPasswordVisible = !this.isPasswordVisible;
          },
          toggleAccordion(section) {
            this.accordion[section] = !this.accordion[section];
        },
        onClickAdd(){
            this.toggleOffCanvasMenu();
        },
        ...mapMutations(["toggleOffCanvasMenu"]),
        removeImage() {
            this.selectedImage = null;
            this.previewImage = null;
            const fileInput = document.getElementById('imageUpload');
            if (fileInput) fileInput.value = '';
        },

        handleimageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.selectedImage = file;
                this.previewImage = URL.createObjectURL(file);
            }
        },

        async handleSubmit(values) {
            this.isLoading = true;
            this.error_msg = "";
            const formData = new FormData();

            if (this.selectedImage) {
                formData.append("image", this.selectedImage);
            }

            if (this.$refs.investorDocsComponent) {
                // 2. Call the getDocuments() method from the child component.
                const documentsToUpload = this.$refs.investorDocsComponent.getDocuments();

                // 3. Loop through the array of documents returned from the child.
                documentsToUpload.forEach((doc, index) => {
                    formData.append(`documents[${index}][notes]`, doc.notes);
                    formData.append(`documents[${index}][type]`, doc.type);
                    formData.append(`documents[${index}][file]`, doc.file);
                });
            }
            formData.append('name', values.user.name);
            formData.append('phone_number', values.user.phone);
            formData.append('email', values.user.email);
            formData.append('password', values.user.password);
            formData.append('active', '1');
            formData.append('address_line1', values.user.address_line1);
            formData.append('address_line2', values.user.address_line2);
            formData.append('city', values.user.city);
            formData.append('state', values.user.state);
            formData.append('postal_code', values.user.postal_code);
            formData.append('country', values.user.country);
            this.loading = true;
            try {

                await createInvestor(formData);
                showSwal.methods.showSwal({
                    type: "success",
                    message: "Store created successfully!",
                    width: 500
                });
                this.loading = false;
                this.$router.push({ name: 'Investors' });
                
            } catch (error) {
                console.error("Error creating store:", error);
                let errorMessage = "Failed to create investor. Please try again.";
                if(error.html) {
                    errorMessage = error.html
                }
                this.error_msg = errorMessage;

            } finally {
                this.loading = false;
            }
        },
        onCountryChange(emittedValue, veeValidateHandleChangeFn) {
            veeValidateHandleChangeFn(emittedValue);

        },
    },
    computed: {
    ...mapState(["isRTL", "showOffCanvas", "hideConfigButton"])
    }
};
</script>

<style scoped>
.card {
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 4px 24px 2px #28294a18;
  border: none;
}
.card-header {
  border-bottom: 1px solid #fff3;
  background: linear-gradient(87deg, #1976d2 60%, #8ec5fc 100%);
}
.accordion-header {
  transition: background 0.2s;
}
.accordion-header.accordion-open {
  /* background: #f0f7fa; */
}
.grid-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px 34px;
}
@media (max-width: 900px) {
  .card { max-width:97vw; padding:0; }
  .grid-form { grid-template-columns: 1fr; gap: 22px 0; }
}
.accordion-content {
  transition: all 0.3s;
}
.upload-label {
  background: #f4f6f9;
  border: 1px dashed #1976d25a;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  color: #1976d2;
  padding: 0.5rem 1.25rem;
  display: inline-flex;
  align-items: center;
}
.upload-label i {
  font-size: 26px;
  color: #1976d2;
}
.image-preview-wrapper {
  position: relative;
  width: 120px;
}
.preview-image {
  width: 100%;
  border: 1.5px solid #d6d8e9;
  border-radius: 10px;
  box-shadow: 0 2px 8px #1976d233;
}
.remove-image-btn {
  position: absolute;
  top: -9px;
  right: -9px;
  background: #fff;
  border: 1.5px solid #e53935;
  color: #e53935;
  font-size: 18px;
  border-radius: 50%;
  cursor: pointer;
  width: 26px;
  height: 26px;
  line-height: 23px;
  text-align: center;
  box-shadow: 0 1px 5px #8882;
}
.button-row .material-button {
  font-size: 1.12em;
  min-width: 120px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.35s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.text-danger {
  color: #e53935;
}
.text-sm {
  font-size: 0.92em;
}
</style>