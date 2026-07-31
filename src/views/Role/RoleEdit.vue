// role-edit.vue
<template>
    <div>
        <!-- The AppFormNew (VeeValidate Form) will now correctly initialize MaterialInput -->
        <AppFormNew
            role="form"
            :validation-schema="schema"
            :initial-values="formValues" 
            @submit="handleSubmit"
            v-slot="{ errors }" 
            >
            {{ errors }}
                <!-- No v-model here, MaterialInput uses useField internally -->
                <div class="mt-5">
                    <material-input id="name" name="name" label="Name" isRequired />
                </div>
                <div class="mt-5">
                    <material-input id="contact_person" name="contact_person" label="Contact Person" />
                </div>
                <div class="mt-5">
                    <material-input id="contact_email" name="contact_email" label="Contact Email" isRequired />
                </div>
                <div class="mt-5">
                    <material-input id="contact_phone" name="contact_phone" label="Contact Phone" isRequired />
                </div>
                <div class="mt-5">
                    <material-input id="address_line1" name="address_line1" label="Address Line 1" isRequired />
                </div>
                <div class="mt-5">
                    <material-input id="address_line2" name="address_line2" label="Address Line 2" />
                </div>
                <div class="mt-5">
                    <material-input id="city" name="city" label="City" isRequired />
                </div>
                <div class="mt-5">
                    <material-input id="state" name="state" label="State" isRequired />
                </div>
                <div class="mt-5">
                    <material-input id="postal_code" name="postal_code" label="Postal Code" isRequired />
                </div>

                <div class="button-row d-flex mt-4">
                    <material-button color="dark" variant="gradient" class="ms-auto mb-0 js-btn-next">
                    Update Role
                    </material-button>
                </div>
        </AppFormNew>
    </div>
</template>

<script>
import { Form as AppFormNew } from "vee-validate";
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import * as Yup from 'yup';
import { ref, watch } from 'vue'; // Import ref and watch

export default {
    name: "role-edit",
    components: {
        MaterialInput,
        MaterialButton,
        AppFormNew,
    },
    props: {
        role: {
            type: Object,
            required: true
        }
    },
    setup(props) { // Using setup function for better reactivity with props
        // This form object is now primarily for initial-values and potentially for resetting
        // VeeValidate will manage the actual live form state.
        const formValues = ref({});

        // Function to initialize/reset formValues based on the role prop
        const initializeForm = (roleData) => {
            formValues.value = {
                name: roleData.name || '',
                contact_person: roleData.contact_person || '',
                contact_email: roleData.contact_email || '',
                contact_phone: roleData.contact_phone || '',
                address_line1: roleData.address_line1 || '',
                address_line2: roleData.address_line2 || '',
                city: roleData.city || '',
                state: roleData.state || '',
                postal_code: roleData.postal_code || '',
            };
        };

        // Initialize form when the component is setup
        initializeForm(props.role);

        // Watch for changes in the role prop to re-initialize if needed
        // This is important if the `role` prop can change after the component is mounted
        // and you want the form to reflect that.
        watch(() => props.role, (newRoleData) => {
            initializeForm(newRoleData);
        }, { deep: true }); // Use deep watch if role object structure might change internally

        const schema = Yup.object({
            name: Yup.string().required("Name is required"),
            contact_person: Yup.string().nullable(),
            contact_email: Yup.string().email("Invalid email").required("Email is required"),
            contact_phone: Yup.string().required("Phone is required"),
            address_line1: Yup.string().required("Address is required"),
            address_line2: Yup.string().nullable(),
            city: Yup.string().required("City is required"),
            state: Yup.string().required("State is required"),
            postal_code: Yup.string().required("Postal code is required"),
        });

        const handleSubmit = (values, { resetForm }) => {
            // 'values' here are the validated form values from VeeValidate
            console.log("Form Submitted:", resetForm);
            // Perform your API call or state update with 'values'
            // Example: this.$role.dispatch('updateRole', values);

            // Optionally reset the form after submission
            // resetForm(); // Resets to initial-values
            // resetForm({ values: newInitialValues }); // Resets to new specific values
        };

        return {
            formValues, // This is passed to :initial-values
            schema,
            handleSubmit,
        };
    }
    // If you are not using <script setup> for MaterialInput, and not using setup() here,
    // you'd use computed property for initial-values or watch for data changes.
    // data() {
    //     return {
    //         // form is now mostly for initial state, not direct v-model two-way binding with fields
    //         // schema is defined below
    //     };
    // },
    // computed: {
    //    initialFormValues() {
    //        return {
    //            name: this.role.name || '',
    //            contact_person: this.role.contact_person || '',
    //            // ... other fields
    //        };
    //    }
    // },
    // watch: {
    //    role: {
    //        handler(newRole) {
    //            // If you need to imperatively update the form if `role` changes
    //            // and `initial-values` isn't re-evaluated as desired.
    //            // You might need a ref to AppFormNew to call `setValues` or `resetForm`.
    //            // But often, changing the `key` on AppFormNew or ensuring `initial-values`
    //            // is a new object reference is enough.
    //            // For now, computed `initialFormValues` should handle it.
    //        },
    //        deep: true,
    //        immediate: true // if initialFormValues isn't used right away
    //    }
    // },
    // methods: {
    //   handleSubmit(values) { /* ... */ }
    // }
}
</script>