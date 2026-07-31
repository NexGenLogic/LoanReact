<template>


    <AppFormNew role="form" :validation-schema="schema" @submit="handleSubmit" :initial-values="form">
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
                    <Field name="user.phone" v-slot="{ field, errors, meta }">
                        <material-input id="phone" type="text" label="Phone" variant="static" v-bind="field"
                            :value="field.value" :success="meta.valid && meta.touched" :error="errors.length > 0" />
                        <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                    </Field>
                </div>

                <!-- Branch Fields -->
                <div class="row mt-5">
                    <Field name="branch.branch_name" v-slot="{ field, errors, meta }">
                        <material-input id="branch_name" type="text" label="Branch Name" variant="static" v-bind="field"
                            :value="field.value" :success="meta.valid && meta.touched" :error="errors.length > 0" />
                        <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                    </Field>
                </div>
                <div class="row mt-5">
                    <Field name="branch.phone" v-slot="{ field, errors, meta }">
                        <material-input id="branch_phone" type="text" label="Branch Phone" variant="static"
                            v-bind="field" :value="field.value" :success="meta.valid && meta.touched"
                            :error="errors.length > 0" />
                        <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                    </Field>
                </div>
                <div class="row mt-5">
                    <Field name="branch.address_line1" v-slot="{ field, errors, meta }">
                        <material-input id="address_line1" type="text" label="Address Line 1" variant="static"
                            v-bind="field" :value="field.value" :success="meta.valid && meta.touched"
                            :error="errors.length > 0" />
                        <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                    </Field>
                </div>
                <div class="row mt-5">
                    <Field name="branch.city" v-slot="{ field, errors, meta }">
                        <material-input id="city" type="text" label="City" variant="static" v-bind="field"
                            :value="field.value" :success="meta.valid && meta.touched" :error="errors.length > 0" />
                        <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                    </Field>
                </div>
                <div class="row mt-5">
                    <Field name="branch.state" v-slot="{ field, errors, meta }">
                        <material-input id="state" type="text" label="State" variant="static" v-bind="field"
                            :value="field.value" :success="meta.valid && meta.touched" :error="errors.length > 0" />
                        <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                    </Field>
                </div>

                <!-- Corrected CountrySelect integration with Field -->
                <div class="row mt-5">
                    <Field name="branch.country" v-slot="{ value, handleChange, errors, meta }">
                        <!-- For debugging -->


                        <CountrySelect :modelValue="value" @update:modelValue="onCountryChange($event, handleChange)"
                            id="country" name="country_select_component"
                            :class="{ 'is-invalid': errors.length > 0 && meta.touched, 'is-valid': meta.valid && meta.touched && !errors.length }" />
                        <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                    </Field>
                </div>

                <!-- IMPORTANT: Add field for branch.phone as it's in your schema -->

                <div class="text-danger text-sm mt-1">
                    {{ error_msg }}
                </div>
                <div class="button-row d-flex mt-4">
                    <material-button type="submit" color="dark" variant="gradient" class="ms-auto mb-0 js-btn-next">
                        Create Role
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
import { createRole } from "@/utils/employee_services";
import showSwal from "@/mixins/showSwal.js";

export default {
    name: "ViewCreateEditRoleComponent",
    components: {
        MaterialInput,
        MaterialButton,
        AppFormNew,
        Field,
        CountrySelect,
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
            // It's good practice to initialize form values
            error_msg: "",
            form: {
                user: {
                    name: '',
                    // contact_person: '', // This was in your data but not form/schema
                    contact_email: '',
                    phone: '',
                },
                branch: {
                    branch_name: '',
                    state: '',
                    city: '',
                    country: '',
                    address_line1: '',
                    phone: ''

                },
            },
            schema: Yup.object({
                user: Yup.object({
                    name: Yup.string().required("Name is a required input"),
                    contact_email: Yup.string().email("Invalid email.").required("Email is required."),
                    phone: Yup.string().required("Phone is a required input"),
                }),
                branch: Yup.object({
                    branch_name: Yup.string().required("Branch name is a required input"),
                    address_line1: Yup.string().required("Address is required."),
                    phone: Yup.string().required("Phone is a required input"),
                    city: Yup.string().required("City is a required input"),
                    state: Yup.string().required("State is a required input"),
                    country: Yup.string().required("Country is a required input")
                }),
            }),
        };
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
            formData.append('owner_user_id', loggedInuserId); // Get this dynamically if needed
            formData.append('contact_person', values.user.name); // Adjust if you have a separate field
            formData.append('contact_email', values.user.contact_email);
            formData.append('active', '1'); // '1' for active

            // Append branch fields with the branch[key] format
            formData.append('branch[name]', values.branch.branch_name);
            formData.append('branch[address_line1]', values.branch.address_line1);
            formData.append('branch[city]', values.branch.city);
            formData.append('branch[country]', values.branch.country);
            formData.append('branch[state]', values.branch.state); // Include if API expects branch[state]
            formData.append('branch[phone]', values.branch.phone); // Include if API expects branch[phone]
            // console.log("FormData prepared (cannot directly log contents easily):");
            // for (let [key, value] of formData.entries()) {
            //     console.log(`${key}: ${value}`);
            // }

            try {
                await createRole(formData);
                showSwal.methods.showSwal({
                    type: "success",
                    message: "Role created successfully!",
                    width: 500
                });
                this.$router.push({ name: 'Role' });

            } catch (error) {
                console.error("Error creating store:", error);
                let errorMessage = "Failed to create store. Please try again.";
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