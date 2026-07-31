<template>
    <div class="tabs-container">
        <!-- TAB NAVIGATION -->
        <div class="tabs-nav">
            <button 
                type="button"
                class="tab-button" 
                :class="{ 'active': activeTab === 'details' }"
                @click="activeTab = 'details'">
                Employee Details
            </button>
            <button 
                type="button"
                class="tab-button" 
                :class="{ 'active': activeTab === 'documents' }"
                @click="activeTab = 'documents'">
                Other Details
            </button>
        </div>

        <!-- TAB CONTENT PANELS -->
        <div class="tab-content mt-4">

            <!-- Employee Details Panel -->
            <div v-if="activeTab === 'details'">
    <AppFormNew role="form" :validation-schema="schema" @submit="handleSubmit" :initial-values="initialValues"
        :key="employee.id">
        <div class="multisteps-form__panel border-radius-xl bg-white" data-animation="FadeIn">
            <div class="multisteps-form__content">
                <!-- ... user fields ... -->
                <div class="row mt-5">
                    <Field name="user.name" v-slot="{ field, errors, meta }">
                        <material-input id="name" label="Name" variant="static" v-bind="field" :value="field.value"
                            :success="meta.valid && meta.touched" :error="errors.length > 0" />
                        <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                    </Field>
                </div>
                <div class="row mt-5">
                    <Field name="user.email" v-slot="{ field, errors, meta }">
                        <material-input id="email" type="email" label="Email Address" variant="static" v-bind="field"
                            :value="field.value" :success="meta.valid && meta.touched" :error="errors.length > 0" />
                        <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                    </Field>
                </div>
               <div class="row mt-5">
                    <Field name="user.role_id" v-slot="{ field, errors, meta }">
                        <select id="role" v-bind="field" :success="meta.valid && meta.touched"
                            :error="errors.length > 0" class="form-select mt-2" style="padding:10px;border: 1px solid #ccc;">
                            <option value="" disabled selected> Select Role</option>
                            <option v-for=" role in roles" :key="role.id" :value="role.id" >{{ role.name }}</option>
                        </select>
                        <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                    </Field>
                </div>
                <div class="row mt-5">
                    <Field name="user.phone_number" v-slot="{ field, errors, meta }">
                        <material-input id="phone_number" type="text" label="Contact Phone" variant="static"
                            v-bind="field" :value="field.value" :success="meta.valid && meta.touched"
                            :error="errors.length > 0" />
                        <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                    </Field>
                </div>




                <div class="row mt-5">
                    <Field name="user.address_line1" v-slot="{ field, errors, meta }">
                        <material-input id="address_line1" type="text" label="Address Line 1" variant="static"
                            v-bind="field" :value="field.value" :success="meta.valid && meta.touched"
                            :error="errors.length > 0" />
                        <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                    </Field>
                </div>
                <div class="row mt-5">
                    <Field name="user.address_line2" v-slot="{ field, errors, meta }">
                        <material-input id="address_line2" type="text" label="Address Line 2" variant="static"
                            v-bind="field" :value="field.value" :success="meta.valid && meta.touched"
                            :error="errors.length > 0" />
                        <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                    </Field>
                </div>
                <div class="row mt-5">
                    <Field name="user.city" v-slot="{ field, errors, meta }">
                        <material-input id="city" type="text" label="City" variant="static" v-bind="field"
                            :value="field.value" :success="meta.valid && meta.touched" :error="errors.length > 0" />
                        <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                    </Field>
                </div>
                <div class="row mt-5">
                    <Field name="user.state" v-slot="{ field, errors, meta }">
                        <material-input id="state" type="text" label="State" variant="static" v-bind="field"
                            :value="field.value" :success="meta.valid && meta.touched" :error="errors.length > 0" />
                        <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                    </Field>
                </div>
                <div class="row mt-5">
                    <Field name="user.postal_code" v-slot="{ field, errors, meta }">
                        <material-input id="postal_code" type="text" label="postal_code" variant="static" v-bind="field"
                            :value="field.value" :success="meta.valid && meta.touched" :error="errors.length > 0" />
                        <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                    </Field>
                </div>

                <!-- Corrected CountrySelect integration with Field -->
                <div class="row mt-5">
                    <Field name="user.country" v-slot="{ value, handleChange, errors, meta }">
                        <!-- For debugging -->


                        <CountrySelect :modelValue="value" @update:modelValue="onCountryChange($event, handleChange)"
                            id="country" name="country_select_component"
                            :class="{ 'is-invalid': errors.length > 0 && meta.touched, 'is-valid': meta.valid && meta.touched && !errors.length }" />
                        <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                    </Field>
                </div> 
                <div class="row mt-5">
                    <Field name="user.password" v-slot="{ field, errors, meta }">
                        <material-input id="password" :label="$t('message.password')" variant="static"
                            placeholder="Leave blank to keep current password"
                            v-bind="field" :value="field.value" :success="meta.valid && meta.touched"
                            :error="errors.length > 0" type="password" />
                        <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                    </Field>
                </div>
                <div class="row mt-5">
                    <label for="imageUpload" class="upload-label d-flex align-items-center gap-2 cursor-pointer">
                        <i class="material-icons">cloud_upload</i>
                        <span>Upload Image</span>
                        <input type="file" id="imageUpload" accept="image/*" @change="handleimageUpload" hidden />
                    </label>

                    <!-- Image Preview -->
                    <div v-if="previewImage" class="image-preview-wrapper position-relative mt-3">
                        <img :src="previewImage" class="preview-image" alt="Preview" />
                        <button type="button" class="remove-image-btn" @click="removeImage">×</button>
                    </div>
                    <div class="text-danger text-sm mt-1">
                       
                    </div>
                </div>
                <div class="text-danger text-sm mt-1" v-html="error_msg">
                   
                </div>
                <div class="button-row d-flex mt-4">
                    <material-button type="submit" fullWidth=true variant="gradient" class="ms-auto mb-0 js-btn-next">
                        Submit
                    </material-button>
                </div>
            </div>
        </div>
    </AppFormNew>

</div>

            <!-- Documents Approval Panel -->
            <div v-if="activeTab === 'documents'">
                <div class="border-radius-xl bg-white p-4">
                    <h4>Other details</h4>
                    <p class="text-secondary">Other user details</p>
                    <!-- You can add new form elements for file uploads or document lists here -->
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import { Form as AppFormNew, Field } from "vee-validate"; // Import Field
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import CountrySelect from "@/views/components/CountrySelect.vue";
import * as Yup from 'yup';
import { updateEmployee } from "@/utils/employee_services";
import showSwal from "@/mixins/showSwal.js";
import {fetchRoles} from "@/utils/role_services";

export default {
    name: "EditViewEmployeeComponent",
    components: {
        MaterialInput,
        MaterialButton,
        AppFormNew,
        Field,
        CountrySelect,
    },
    props: {
        employee: {
            type: Object,
            default: () => ({})
        },
    },
    data() {
        return {
            roles: {},
            activeTab: 'details',
            previewImage: "",
            selectedImage : "",
            error_msg: "",
            schema: Yup.object({
                user: Yup.object({
                    name: Yup.string().required("Name is a required input"),
                    email: Yup.string().email("Invalid email.").required("Email is required."),
                    phone_number: Yup.string().required("phone_number is a required input"),
                    address_line1: Yup.string().notRequired("Address is required."),
                    city: Yup.string().notRequired("City is a required input"),
                    state: Yup.string().notRequired("State is a required input"),
                    postal_code: Yup.string().notRequired("Postal code is a required input"),
                    country: Yup.string().notRequired("Country is a required input"),
                    password : Yup.string().notRequired(),
                    role_id :  Yup.string().required("Role is a required input")
                }),

            }),
        };
    },
    watch: {
        employee: {
            handler(newStore) {
                if (newStore?.image) {
                    this.previewImage = newStore.image;
                } else {
                    this.previewImage = "";
                }
                this.selectedImage = null;
            },
            immediate: true, // Ensures it's triggered on initial load
            deep: true       // If nested values of employee might change
        }
    },
    mounted() {
        this.getRoles();
        if (this.employee?.image) {
            // Ensure you construct the full URL to the image
            this.previewImage =  this.employee.image; 
        }else {
            this.previewImage ="";
        }
    },
    computed: {
        initialValues() {
            return {
                user: {
                    name: this.employee?.name || '',
                    email: this.employee?.email || '',
                    phone_number: this.employee?.phone_number || '',
                    address_line1: this.employee?.address_line1 || '',
                    address_line2: this.employee?.address_line2 || '',
                    city: this.employee?.city || '',
                    state: this.employee?.state || '',
                    postal_code: this.employee?.postal_code || '',
                    country: this.employee?.country || '',
                    role_id : this.employee?.role_id,
                    
                }
            };
        }
    },
    methods: {
        async getRoles(){
            try {
                let response = await fetchRoles();
                this.roles = response.data.data

            }catch(error) {
                console.log(error)
            }
            
            
        },
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
            const formData = new FormData();
            if (this.selectedImage) {
                formData.append("image", this.selectedImage);
            }else if (!this.previewImage && this.employee.image) {
                formData.append("remove_image", 1);
            }
            formData.append('name', values.user.name);
            formData.append('email', values.user.email);
            formData.append('phone_number', values.user.phone_number);
            formData.append('address_line1', values.user.address_line1);
            formData.append('address_line2', values.user.address_line2);
            formData.append('city', values.user.city);
            formData.append('country', values.user.country);
            formData.append('state', values.user.state); // Include if API expects state]
            formData.append('password', values.user.password);
            formData.append('password_confirmation', values.user.password);
            formData.append('role_id', values.user.role_id);
            formData.append('postal_code', values.user.postal_code);

            try {
                await updateEmployee(this.employee.id, formData);
                showSwal.methods.showSwal({
                    type: "success",
                    message: "Store updated successfully!",
                    width: 500
                });
                this.$emit('employee-updated');

            } catch (error) {
                console.error("Error creating employee:", error);
                let errorMessage = "Failed to update employee. Please try again.";
                if(error.html) {
                    errorMessage = error.html
                }
                this.error_msg = errorMessage;
                

            } finally {
                this.isLoading = false;
            }
        },
        onCountryChange(emittedValue, veeValidateHandleChangeFn) {
            veeValidateHandleChangeFn(emittedValue);

        },
    }
};
</script>

<style scoped>
/* Optional: Add some basic styling for error messages */
.text-danger {
    color: #dc3545;
    /* Bootstrap's default danger color */
}

.text-sm {
    font-size: 0.875em;
}

.mt-1 {
    margin-top: 0.25rem !important;
}
.upload-label {
    font-weight: 500;
    cursor: pointer;
    color: #333;
}

.upload-label i {
    font-size: 24px;
    color: #666;
}

.image-preview-wrapper {
    position: relative;
    width: 200px;
    height: auto;
}

.preview-image {
    max-width: 100%;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.remove-image-btn {
    position: absolute;
    top: -8px;
    right: 10px;
    background-color: #fff;
    border: 1px solid red;
    color: red;
    font-size: 16px;
    border-radius: 50%;
    cursor: pointer;
    width: 24px;
    height: 24px;
    line-height: 20px;
    text-align: center;
}
.tabs-nav {
    display: flex;
    gap: 24px; /* Space between tab buttons */
    border-bottom: 1px solid #e9ecef; /* Light grey bottom border */
}

.tab-button {
    background: none;
    border: none;
    padding: 10px 4px; /* Vertical and horizontal padding */
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    color: #6c757d; /* Inactive tab color (grey) */
    position: relative;
    top: 1px; /* Aligns the bottom border nicely */
    border-bottom: 2px solid transparent; /* Placeholder for active border */
}

.tab-button.active {
    color: #344767; /* Active tab color (dark) */
    border-bottom-color: #344767; /* The underline for the active tab */
}
</style>