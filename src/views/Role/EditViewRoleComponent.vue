<template>


<AppFormNew
    role="form"
    :validation-schema="schema"
    @submit="handleSubmit"
    :initial-values="initialValues"
    :key="store.id"
>
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
                    <Field name="user.contact_email" v-slot="{ field, errors, meta }">
                        <material-input id="email" type="email" label="Email Address" variant="static" v-bind="field"
                            :value="field.value" :success="meta.valid && meta.touched" :error="errors.length > 0" />
                        <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                    </Field>
                </div>
                <div class="row mt-5">
                    <Field name="user.contact_person" v-slot="{ field, errors, meta }">
                        <material-input id="contact_person" type="text" label="Contact Person" variant="static" v-bind="field"
                            :value="field.value" :success="meta.valid && meta.touched" :error="errors.length > 0" />
                        <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                    </Field>
                </div>
                <div class="row mt-5">
                    <Field name="user.contact_phone" v-slot="{ field, errors, meta }">
                        <material-input id="contact_phone" type="text" label="Contact Phone" variant="static" v-bind="field"
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
                    <Field name="user.website" v-slot="{ field, errors, meta }">
                        <material-input id="website" type="text" label="website" variant="static" v-bind="field"
                            :value="field.value" :success="meta.valid && meta.touched" :error="errors.length > 0" />
                        <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                    </Field>
                </div>
                <div class="row mt-5">
                    <Field name="user.logo" v-slot="{ field, errors, meta }">
                        <material-input id="logo" type="text" label="logo" variant="static" v-bind="field"
                            :value="field.value" :success="meta.valid && meta.touched" :error="errors.length > 0" />
                        <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                    </Field>
                </div>
                <div class="text-danger text-sm mt-1">
                    {{ error_msg }}
                </div>
                <div class="button-row d-flex mt-4">
                    <material-button type="submit" color="dark" variant="gradient" class="ms-auto mb-0 js-btn-next">
                        Submit
                    </material-button>
                </div>
            </div>
        </div>
    </AppFormNew>


</template>

<script>
import { Form as AppFormNew, Field } from "vee-validate"; // Import Field
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import CountrySelect from "@/views/components/CountrySelect.vue";
import * as Yup from 'yup';
import { updateRole } from "@/utils/role_services";
import showSwal from "@/mixins/showSwal.js";

export default {
    name: "EditViewRoleComponent",
    components: {
        MaterialInput,
        MaterialButton,
        AppFormNew,
        Field,
        CountrySelect,
    },
    props: {
        store: {
            type: Object,
            default: () => ({})
        },
  },
    data() {
        return {
            // It's good practice to initialize form values
            error_msg: "",
            // form: {
            //     user: {
            //         name: '',
            //         contact_email: '',
            //         contact_phone: '',
            //         contact_person : "",
            //         address_line1: '',
            //         address_line2: '',
            //         state: '',
            //         city: '',
            //         country: '',
            //         postal_code :'',
            //         website :'',
            //         logo :''
            //     },
                
            // },
            schema: Yup.object({
                user: Yup.object({
                    name: Yup.string().required("Name is a required input"),
                    contact_email: Yup.string().email("Invalid email.").required("Email is required."),
                    contact_phone: Yup.string().required("contact_phone is a required input"),
                    contact_person: Yup.string().required("Contact person is a required input"),
                    address_line1: Yup.string().required("Address is required."),
                    city: Yup.string().required("City is a required input"),
                    state: Yup.string().required("State is a required input"),
                    postal_code: Yup.string().required("Postal code is a required input"),
                    country: Yup.string().required("Country is a required input")
                }),
                
            }),
        };
    },

computed: {
    initialValues() {
        return {
            user: {
                name: this.store?.name || '',
                contact_email: this.store?.contact_email || '',
                contact_phone: this.store?.contact_phone || '',
                contact_person: this.store?.contact_person || '',
                address_line1: this.store?.address_line1 || '',
                address_line2: this.store?.address_line2 || '',
                city: this.store?.city || '',
                state: this.store?.state || '',
                postal_code: this.store?.postal_code || '',
                country: this.store?.country || '',
                website: this.store?.website || '',
                logo: this.store?.logo_url || '',
            }
        };
    }
},
    methods: {
        // handleSubmit receives the validated form values
        async handleSubmit(values) {
            this.isLoading = true;
            let loggedInUser = localStorage.getItem('user');
            let loggedInuserId = 1;
            if (loggedInUser) {
                loggedInUser = JSON.parse(loggedInUser);
                loggedInuserId = loggedInUser.id;
            }
            console.log("Form data passed to handleSubmit:", values);

            // Create a FormData object
            const formData = new FormData();

            // Append top-level fields
            formData.append('name', values.user.name);
            formData.append('owner_user_id',loggedInuserId); // Get this dynamically if needed
            formData.append('contact_person', values.user.contact_person); // Adjust if you have a separate field
            formData.append('contact_email', values.user.contact_email);
            formData.append('contact_phone', values.user.contact_phone);
            // formData.append('active', '1'); // '1' for active

            // Append branch fields with the key] format
            // formData.append('name]', values.user.branch_name);
            formData.append('address_line1', values.user.address_line1);
            formData.append('address_line2', values.user.address_line2);
            formData.append('city', values.user.city);
            formData.append('country', values.user.country);
            formData.append('state', values.user.state); // Include if API expects state]
            formData.append('logo', values.user.logo);
            formData.append('website', values.user.website);

            try {
                await updateRole(this.store.id,formData);
                showSwal.methods.showSwal({
                    type: "success",
                    message: "Role updated successfully!",
                    width: 500
                });
                this.$router.push({ name: 'Role' });

            } catch (error) {
                console.error("Error creating store:", error);
                let errorMessage = "Failed to update store. Please try again.";
                if (error.response) {
                    console.error("Error data:", error.response.data);
                    if (error.response.data && error.response.data.message) {
                        errorMessage = error.response.data.message;
                    }
                    if (error.response.data && error.response.data.errors) {
                        const backendErrors = Object.values(error.response.data.errors).flat().join('\n');
                        if (backendErrors) {
                            errorMessage += `\nDetails:\n${backendErrors}`;
                        }
                    }
                } else if (error.request) {
                    errorMessage = "No response from server. Please check your network connection.";
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
</style>