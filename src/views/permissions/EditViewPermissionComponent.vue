<template>


<AppFormNew
    role="form"
    :validation-schema="schema"
    @submit="handleSubmit"
    :initial-values="initialValues"
    :key="permission ? permission.id : 1 "
>
        <div class="multisteps-form__panel border-radius-xl bg-white" data-animation="FadeIn">
            <div class="multisteps-form__content">
                <!-- ... permission fields ... -->
                <div class="row mt-5">
                    <Field name="permission.name" v-slot="{ field, errors, meta }">
                        <material-input id="name" :label=" $t('message.name')" variant="static" v-bind="field" :value="field.value"
                            :success="meta.valid && meta.touched" :error="errors.length > 0" />
                        <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                    </Field>
                </div>
                <div class="row mt-5">
                    <Field name="permission.description" v-slot="{ field, errors, meta }">
                        <material-input id="description" :label=" $t('message.description')" variant="static" v-bind="field" :value="field.value"
                            :success="meta.valid && meta.touched" :error="errors.length > 0" />
                        <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                    </Field>
                </div>
                <div class="row mt-5">
                    <Field name="permission.status" v-slot="{ field, errors, meta }">
                        <material-switch id="status" label="{{ $t('message.status') }}" variant="static" v-bind="field" :value="field.value"
                        :success="meta.valid && meta.touched" :error="errors.length > 0" :checked="permission_status" @change="permission_status = !permission_status">
{{permission_status === true ? $t('message.active')  :  $t('message.inactive')  }}
 </material-switch>
                        <div v-if="errors.length" class="text-danger text-sm mt-1">{{ errors[0] }}</div>
                    </Field>
                </div>

                <div class="text-danger text-sm mt-1">
                    {{ error_msg }}
                </div>
                <div class="button-row d-flex mt-4">
                    <material-button type="submit" color="dark" variant="gradient" class="ms-auto mb-0 js-btn-next">
                        {{ $t('message.submit') }}
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
import * as Yup from 'yup';
import { updatePermission, createPermission } from "@/utils/permission_services";
import showSwal from "@/mixins/showSwal.js";
import MaterialSwitch from "@/components/MaterialSwitch.vue";

export default {
    name: "EditViewEmployeeComponent",
    components: {
        MaterialInput,
        MaterialButton,
        AppFormNew,
        Field,
        MaterialSwitch
    },
    props: {
        permission: {
            type: Object,
            default: () => ({})
        },
  },
    data() {
        return {
            // It's good practice to initialize form values
            error_msg: "",
            permission_status:true,
            schema: Yup.object({
                permission: Yup.object({
                    name: Yup.string().required("Name is a required input"),
                    
                }),
                
            }),
        };
    },

computed: {
    initialValues() {
        return {
            permission: {
                name: this.permission?.name || '',
                description: this.permission?.description || '',
                status: this.permission?.active || '',
               
            }
        };
    }
},
    methods: {
        // handleSubmit receives the validated form values
        async handleSubmit(values) {
            this.isLoading = true;
            

            // Create a FormData object
            const formData = new FormData();

            // Append top-level fields
            formData.append('name', values.permission.name);
            
            formData.append('description', values.permission.description);
            formData.append('status', values.permission.status);

            try {
                if(!this.permission) {
                    await createPermission(formData);
                }else {
                    await updatePermission(this.permission.id,formData);
                }
                
                showSwal.methods.showSwal({
                    type: "success",
                    message: "Store updated successfully!",
                    width: 500
                });
                this.$router.push({ name: 'Store' });

            } catch (error) {
                console.error("Error creating permission:", error);
                let errorMessage = "Failed to update permission. Please try again.";
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