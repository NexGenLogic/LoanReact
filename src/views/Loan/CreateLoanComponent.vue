<template>
    <AppFormNew role="form" :validation-schema="schema" @submit="handleSubmit" :initial-values="form">
               <div class="multisteps-form__panel border-radius-xl bg-white" data-animation="FadeIn">
            <div class="multisteps-form__content">

                <div class="accordion">
                    <!-- Loan Details Accordion -->
                    <div class="accordion-item">
                        <h5 class="accordion-header" @click="toggleAccordion('loanDetails')">
                            Loan Details
                            <i class="material-icons">{{ accordion.loanDetails ? 'expand_less' : 'expand_more'
                                }}</i>
                        </h5>
                        <div class="accordion-content" v-show="accordion.loanDetails">
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
                    <Field name="user.phone" v-slot="{ field, errors, meta }">
                        <material-input id="phone" type="text" label="Phone" variant="static" v-bind="field"
                            :value="field.value" :success="meta.valid && meta.touched" :error="errors.length > 0" />
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
                        <material-input id="postal_code" type="text" label="Postal Code" variant="static" v-bind="field"
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
                    <label for="imageUpload" class="upload-label d-flex align-items-center gap-2 cursor-pointer">
                        <i class="material-icons">cloud_upload</i>
                        <span>Upload Image</span>
                        <input type="file" id="imageUpload" accept="image/*" @change="handleimageUpload" hidden />
                    </label>

                    <!-- Image Preview -->
                    <div v-if="previewImage" class="image-preview-wrapper position-relative mt-3">
                        <img :src="previewImage" class="preview-image" alt="Preview" />
                        <button class="remove-image-btn" @click="removeImage">×</button>
                    </div>
                    <!-- <div class="text-danger text-sm mt-1">
                        {{ no_img_error_msg }}
                    </div> -->
                </div>

                        </div>
                    </div>

                    <!-- Loan Documents Accordion -->
                    <div class="accordion-item">
                        <h5 class="accordion-header" @click="toggleAccordion('loanDocuments')">
                            Loan Documents
                            <i class="material-icons">{{ accordion.loanDocuments ? 'expand_less' : 'expand_more'
                                }}</i>
                        </h5>
                        <div class="accordion-content" v-show="accordion.loanDocuments">
                            <div class="row mt-5">
                                 <LoanDocuments ref="loanDocsComponent" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>


                <div class="text-danger text-sm mt-1" v-html="error_msg">
                    
                </div>
                <div class="button-row d-flex mt-4">
                    <material-button type="submit" color="dark" variant="gradient" class="ms-auto mb-0 js-btn-next">
                        <span v-if="loading == false">{{ $t('message.save') }}</span>
                        <PulseLoader v-if="loading" text="Saving" />
                    </material-button>
                </div>
            </div>
        
    </AppFormNew>
    <OffCanvas  :toggle="toggleOffCanvasMenu" :class="[showOffCanvas ? 'show ' : '', hideConfigButton ? 'd-none' : '']"
        :closable="true" :title="'Add User' " :id="'add_user'" >
      
    </OffCanvas>

</template>

<script>
import { Form as AppFormNew, Field } from "vee-validate"; // Import Field
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import CountrySelect from "@/views/components/CountrySelect.vue";
import * as Yup from 'yup';
import { createLoan } from "@/utils/loan_services";
import showSwal from "@/mixins/showSwal.js";
import PulseLoader from "../PulseLoader.vue";
// import EditViewLoanComponent from "../Loans/EditViewLoanComponent.vue";
import {  mapMutations, mapState } from "vuex";
import OffCanvas from "@/components/OffCanvas.vue";
import LoanDocuments from './LoanDocuments.vue'

export default {
    name: "ViewCreateEditLoanComponent",
    components: {
        MaterialInput,
        MaterialButton,
        AppFormNew,
        Field,
        CountrySelect,
        PulseLoader,
        // EditViewLoanComponent,
        OffCanvas,
        LoanDocuments
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
                loanDetails: true,
                loanDocuments: false
            },
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
                },
            },
            schema: Yup.object({
                user: Yup.object({
                    name: Yup.string().required("Name is a required input"),
                    email: Yup.string().email("Invalid email.").required("Email is required."),
                    phone: Yup.string().required("Phone is a required input"),
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

            if (this.$refs.loanDocsComponent) {
                // 2. Call the getDocuments() method from the child component.
                const documentsToUpload = this.$refs.loanDocsComponent.getDocuments();
console.log(documentsToUpload)
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
            formData.append('active', '1');
            formData.append('address_line1', values.user.address_line1);
            formData.append('address_line2', values.user.address_line2);
            formData.append('city', values.user.city);
            formData.append('state', values.user.state);
            formData.append('postal_code', values.user.postal_code);
            formData.append('country', values.user.country);
            this.loading = true;
            try {

                await createLoan(formData);
                showSwal.methods.showSwal({
                    type: "success",
                    message: "Store created successfully!",
                    width: 500
                });
                this.loading = false;
                this.$router.push({ name: 'LoanList' });
                
            } catch (error) {
                console.error("Error creating store:", error);
                let errorMessage = "Failed to create loan. Please try again.";
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
.accordion {
    width: 100%;
}

.accordion-item {
    border: 1px solid #ccc;
    margin-bottom: 10px;
    border-radius: 5px;
}

.accordion-header {
    background-color: #f1f1f1;
    padding: 15px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.accordion-content {
    padding: 15px;
    border-top: 1px solid #ccc;
}
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
.click-effect {
  transition: transform 0.1s ease;
}
.click-effect:active {
  transform: scale(0.9);
}
</style>