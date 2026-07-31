<template> 
    <div class="bg-white">
        <div class="container top-0 position-sticky z-index-sticky">
            <div class="row">
                <div class="col-12">
                    <!-- <NavBar isBlur="blur my-3 py-2 mt-4 start-0 end-0 mx-4 shadow blur border-radius-lg"
                        btnBackground="bg-gradient-success" v-bind:darkMode="true" /> -->
                </div>
            </div>
        </div>
        <main class="mt-0 main-content">
            <section>
                <div class="page-header min-vh-100">
                    <div class="container">
                        <div class="row">
                            <div
                                class="col-6 d-lg-flex d-none h-100 my-auto pe-0 ps-0 position-absolute top-0 start-0 text-center justify-content-center flex-column">
                                <div class="position-relative h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center"
                                    :style="{
                                        backgroundImage:
                                            'url(' +
                                            require('@/assets/img/illustrations/reg_new.webp') +
                                            ')',
                                        backgroundRepeat: 'no-repeat'
                                    }"></div>
                            </div>
                            <div class="col-xl-4 col-lg-5 col-md-7 d-flex flex-column ms-auto me-auto ms-lg-auto me-lg-5"
                                style="min-width: 550px;">
                                <div class="card card-plain">
                                    <div class="pb-0 card-header bg-transparent mb-4 d-flex">
                                        <img :src="logo" class="navbar-brand-img " alt="main_logo"
                                            style="height: 40px;" />
                                        <h4 class="font-weight-bolder heading"
                                            style="margin-top: 10px;margin-left: 10px;">Sign Up</h4>

                                    </div>
                                    <div class="card-body">
                                        <AppForm ref="formRef" role="form" :validation-schema="currentSchema">

                                            <ul id="progressbar">
                                                <li :class="{ active: step >= 1 }" id="user"> <strong>User</strong><br>
                                                    <strong>Details</strong>
                                                </li>
                                                <li :class="{ active: step >= 2 }" id="merchant">
                                                    <strong>Merchant</strong><br> <strong>Details</strong>
                                                </li>
                                                <li :class="{ active: step >= 3 }" id="branch">
                                                    <strong>Branch</strong><br> <strong>Details</strong>
                                                </li>
                                                <li :class="{ active: step >= 4 }" id="finish"><strong>Review</strong>
                                                </li>
                                            </ul>
                                            <fieldset v-if="step === 1">
                                                <div class="mb-3">
                                                    <material-input-field id="name" v-model:value="form.user.name"
                                                        label="Name" name="name" variant="static" />
                                                </div>
                                                <div class="mb-3">
                                                    <material-input-field id="email" v-model:value="form.user.email"
                                                        type="email" label="Email" name="email" variant="static" />
                                                </div>
                                                <div class="mb-3">
                                                    <material-input-field id="phone" v-model:value="form.user.phone"
                                                        label="Phone" name="phone" variant="static" />
                                                </div>
                                                <div class="mb-3">
                                                    <material-input-field id="password"
                                                        v-model:value="form.user.password" type="password"
                                                        label="Password" name="password" variant="static" />
                                                </div>
                                                <div class="mb-3">
                                                    <material-input-field id="confirmPassword"
                                                        v-model:value="form.user.confirmPassword" type="password"
                                                        label="Confirm Password" name="confirmPassword"
                                                        variant="static" />
                                                </div>

                                                <material-checkbox-field id="flexCheckDefault"
                                                    v-model:checked="termsChecked" name="checkbox">
                                                    I agree the
                                                    <a href="../../../pages/privacy.html"
                                                        class="text-dark font-weight-bolder">Terms and
                                                        Conditions</a>
                                                </material-checkbox-field>
                                                <div class="text-center">
                                                    <!-- <material-button type="button" color="success" variant="gradient"
                                                        full-width class="mt-4 mb-0" @click="validateStepOne">
                                                        Next
                                                    </material-button> -->
                                                    <button type="button" class="btn btn-primary w-100"
                                                        @click="validateStepOne">Next</button>
                                                </div>
                                            </fieldset>
                                            <fieldset v-if="step === 2">
                                                <div class="mb-3">
                                                    <material-input-field id="merchant_name"
                                                        v-model:value="form.merchant.name" label="Merchnat Name"
                                                        name="merchant_name" variant="static" />
                                                </div>
                                                <div class="mb-3">
                                                    <material-input-field id="merchant_phone"
                                                        v-model:value="form.merchant.phone" label="Merchant Phone"
                                                        name="merchant_phone" variant="static" />
                                                </div>
                                                <div class="mb-3">
                                                    <material-input-field id="merchant_website"
                                                        v-model:value="form.merchant.website" label="Merchant website"
                                                        name="merchant_website" variant="static" />
                                                </div>
                                                <div class="mb-3">
                                                    <material-input-field id="merchant_address_line_1"
                                                        v-model:value="form.merchant.address_line_1"
                                                        label="Merchant Address" name="merchant_address_line_1"
                                                        variant="static" />
                                                </div>
                                                <div class="mb-3">
                                                    <material-input-field id="merchant_city"
                                                        v-model:value="form.merchant.city" label="Merchant city"
                                                        name="merchant_city" variant="static" />
                                                </div>
                                                <div class="mb-3">
                                                    <material-input-field id="merchant_state"
                                                        v-model:value="form.merchant.state" label="Merchant state"
                                                        name="merchant_state" variant="static" />
                                                </div>
                                                <div class="mb-3">
                                                    <material-input-field id="merchant_postalcode"
                                                        v-model:value="form.merchant.postalcode"
                                                        label="Merchant postalcode" name="merchant_postalcode"
                                                        variant="static" />
                                                </div>
                                                <div class="mb-3">
                                                    <CountrySelect v-model="form.merchant.country" id="merchant_country"
                                                        name="merchant_country" />
                                                </div>
                                                <div class="text-center"
                                                    style="display: flex;gap:20px;align-items: end;justify-content: end;">
                                                    <!-- <material-button type="button" color="success" variant="gradient"
                                                        full-width class="mt-4 mb-0" @click="prevStep">
                                                        Previous
                                                    </material-button> -->
                                                    <!-- <material-button type="button" color="success" variant="gradient"
                                                        full-width class="mt-4 mb-0" @click="validateStepOne">
                                                        Next
                                                    </material-button> -->
                                                    <button type="button" class="btn btn-outline-primary mt-4 mb-0"
                                                        @click="prevStep">Previous</button>
                                                    <button type="button" class="btn btn-primary mt-4 mb-0"
                                                        @click="validateStepOne">Next</button>
                                                </div>
                                            </fieldset>
                                            <fieldset v-if="step === 3">

                                                <material-checkbox id="checkboxId" :checked="address_same_merchant"
                                                    @change="handleSameAddressCheckbox">Address same as
                                                    merchant</material-checkbox>
                                                <div class="mb-3">
                                                    <material-input-field id="branch_name"
                                                        v-model:value="form.branch.branch_name" label="Branch Name"
                                                        name="branch_name" variant="static" />
                                                </div>
                                                <div class="mb-3">
                                                    <material-input-field id="branch_phone"
                                                        v-model:value="form.branch.phone" label="Branch phone"
                                                        name="branch_phone" variant="static" />
                                                </div>
                                                <div class="mb-3">
                                                    <material-input-field id="branch_address_line_1"
                                                        v-model:value="form.branch.address_line_1"
                                                        :key="form.branch.address_line_1"
                                                        :disabled="address_same_merchant" label="Branch address"
                                                        name="branch_address_line_1" variant="static" />
                                                </div>
                                                <div class="mb-3">
                                                    <material-input-field id="branch_city"
                                                        v-model:value="form.branch.city" label="branch city"
                                                        :key="form.branch.city" :disabled="address_same_merchant"
                                                        name="branch_city" variant="static" />
                                                </div>
                                                <div class="mb-3">
                                                    <material-input-field id="branch_state"
                                                        v-model:value="form.branch.state" label="branch state"
                                                        :key="form.branch.state" :disabled="address_same_merchant"
                                                        name="branch_state" variant="static" />
                                                </div>
                                                <div class="mb-3">
                                                    <material-input-field id="branch_postalcode"
                                                        v-model:value="form.branch.postalcode"
                                                        :key="form.branch.postalcode" :disabled="address_same_merchant"
                                                        label="branch postalcode" name="branch_postalcode"
                                                        variant="static" />
                                                </div>
                                                <div class="mb-3">
                                                    <CountrySelect v-model="form.branch.country"
                                                        :key="form.branch.country" :disabled="address_same_merchant"
                                                        id="branch_country" name="branch_country" />
                                                </div>
                                                <div class="text-center"
                                                    style="display: flex;gap:20px;align-items: end;justify-content: end;">
                                                    <button type="button" class="btn btn-outline-primary mt-4 mb-0"
                                                        @click="prevStep">Previous</button>
                                                    <button type="button" class="btn btn-primary mt-4 mb-0"
                                                        @click="validateStepOne">Next</button>
                                                </div>
                                            </fieldset>
                                            <fieldset v-if="step === 4">
                                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <!-- User Details -->
                                                    <div class="p-4 border rounded shadow m-4">
                                                        <h3 class="text-md font-bold mb-2">User Details</h3>
                                                        <p><strong>Name:</strong> {{ form.user.name }}</p>
                                                        <p><strong>Email:</strong> {{ form.user.email }}</p>
                                                        <p><strong>Phone:</strong> {{ form.user.phone }}</p>
                                                    </div>

                                                    <!-- Merchant Details -->
                                                    <div class="p-4 border rounded shadow m-4">
                                                        <h3 class="text-md font-bold mb-2">Merchant Details</h3>
                                                        <p><strong>Name:</strong> {{ form.merchant.name }}</p>
                                                        <p><strong>Phone:</strong> {{ form.merchant.phone }}</p>
                                                        <p><strong>Website:</strong> {{ form.merchant.website }}</p>
                                                        <p><strong>Address:</strong> {{ form.merchant.address_line_1 }},
                                                            {{ form.merchant.city }}, {{ form.merchant.state }} {{
                                                                form.merchant.postalcode }}</p>
                                                        <p><strong>Country:</strong> {{ form.merchant.country }}</p>
                                                    </div>

                                                    <!-- Branch Details -->
                                                    <div class="p-4 border rounded shadow m-4">
                                                        <h3 class="text-md font-bold mb-2">Branch Details</h3>
                                                        <p><strong>Branch Name:</strong> {{ form.branch.branch_name }}
                                                        </p>
                                                        <p><strong>Phone:</strong> {{ form.branch.phone }}</p>
                                                        <p><strong>Address:</strong> {{ form.branch.address_line_1 }},
                                                            {{ form.branch.city }}, {{ form.branch.state }} {{
                                                                form.branch.postalcode }}</p>
                                                        <p><strong>Country:</strong> {{ form.branch.country }}</p>
                                                    </div>
                                                </div>
                                                <div id="error_reg" v-html="errorHtml" style="display: flex;flex-direction: column;align-items: end;font-style:italic"></div>
                                                <!-- Submit Button -->
                                                <div class="text-center"
                                                    style="display: flex;gap:20px;align-items: end;justify-content: end;">
                                                    <!-- <button type="button" class="btn btn-outline-primary mt-4 mb-0"
                                                        @click="prevStep">Previous</button> -->
                                                    <button type="button" class="btn btn-primary mt-4 mb-0 "
                                                        @click="validateStepOne">Submit</button>
                                                </div>
                                            </fieldset>


                                        </AppForm>
                                        <!-- <div class="progress">
                                            <div class="progress-bar progress-bar-striped progress-bar-animated"
                                                role="progressbar" :style="{ width: progress + '%' }"
                                                :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
                                            </div>
                                        </div> -->
                                    </div>
                                    
                                    <div class="px-1 pt-0 text-center card-footer px-lg-2">
                                        <p class="mx-auto mb-4 text-sm">
                                            Already have an account?
                                            <router-link :to="{ name: 'merchant.login' }"
                                                class="text-success text-gradient font-weight-bold">Sign
                                                in</router-link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<script>
// import NavBar from "@/views/PageLayout/Navbar.vue";
import logo from "@/assets/img/logo-dark.png";
import MaterialInputField from "@/components/MaterialInputField.vue";
import MaterialCheckboxField from "@/components/MaterialCheckboxField.vue";
// import MaterialSwitch from "@/components/MaterialSwitch.vue";
// import MaterialButton from "@/components/MaterialButton.vue";
import MaterialCheckbox from "@/components/MaterialCheckbox.vue";
import showSwal from "@/mixins/showSwal";
const body = document.getElementsByTagName("body")[0];
import { mapMutations } from "vuex";
import { Form as AppForm } from "vee-validate";
import * as Yup from 'yup';
import { ref } from 'vue';
import { computed } from 'vue';
import CountrySelect from "@/views/components/CountrySelect.vue";
// import { callApiWithButtonControl } from '@/utils/apiHelper';
import { register } from "@/utils/api_services";

export default {
    name: "SignUp",
    components: {
        // NavBar,
        MaterialInputField,
        MaterialCheckboxField,
        MaterialCheckbox,
        // MaterialButton,
        // MaterialSwitch,
        AppForm,
        CountrySelect
    },
    setup() {
        const step = ref(1);
        const formRef = ref(null); // <--- this was missing here

        const schemas = {
            1: Yup.object({
                name: Yup.string().required("Name is required."),
                email: Yup.string().email("Invalid email.").required("Email is required."),
                password: Yup.string().required("Password is required.").min(8, "Minimum 8 characters."),
                confirmPassword: Yup.string()
                    .required("Confirm password is required.")
                    .oneOf([Yup.ref('password')], 'Passwords must match.'),
                checkbox: Yup.boolean().oneOf([true], 'You must agree to the terms and conditions'),
            }),
            2: Yup.object({
                merchant_name: Yup.string().required("Merchant name is required."),
                merchant_phone: Yup.string().required("Merchant phone is required."),
                merchant_website: Yup.string().url("Must be a valid URL").nullable(),
                merchant_address_line_1: Yup.string().required("Address is required."),
                merchant_city: Yup.string().required("City is required."),
                merchant_state: Yup.string().required("State is required."),
                merchant_postalcode: Yup.string().required("Postal code is required."),

            }),
            3: Yup.object({
                branch_name: Yup.string().required("Branch name is required."),
                branch_phone: Yup.string().required("Branch phone is required."),
                branch_address_line_1: Yup.string().required("Address is required."),
                branch_city: Yup.string().required("City is required."),
                branch_state: Yup.string().required("State is required."),
                branch_postalcode: Yup.string().required("Postal code is required."),

            }),
        };

        const currentSchema = computed(() => schemas[step.value]);

        return { step, formRef, currentSchema }; // include formRef here
    },
    data() {
        return {
            logo,
            user: [],
            errorHtml: '',
            termsChecked: true,
            address_same_merchant: false,
            form: {
                user: {
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    phone: '',
                },
                merchant: {
                    name: '',
                    phone: '',
                    website: '',
                    address_line_1: '',
                    city: '',
                    state: '',
                    postalcode: '',
                    country: '',
                },
                branch: {
                    branch_name: '',
                    phone: '',
                    address_line_1: '',
                    city: '',
                    state: '',
                    postalcode: '',
                    country: '',
                },
            },
        }
    },
    beforeMount() {
        this.toggleEveryDisplay();
        this.toggleHideConfig();
        body.classList.remove("bg-gray-100");
    },
    beforeUnmount() {
        this.toggleEveryDisplay();
        this.toggleHideConfig();
        body.classList.add("bg-gray-100");
    },
    methods: {
        ...mapMutations(["toggleEveryDisplay", "toggleHideConfig"]),
        async handleSignup() {
            const payload = new FormData();
            // User fields
            payload.append('user[name]', this.form.user.name);
            payload.append('user[email]', this.form.user.email);
            payload.append('user[password]', this.form.user.password);
            payload.append('user[password_confirmation]', this.form.user.confirmPassword);
            payload.append('user[phone_number]', this.form.user.phone);

            // Merchant fields
            payload.append('merchant[name]', this.form.merchant.name);
            payload.append('merchant[contact_phone]', this.form.merchant.phone);
            payload.append('merchant[website]', this.form.merchant.website);
            payload.append('merchant[address_line1]', this.form.merchant.address_line_1);
            payload.append('merchant[city]', this.form.merchant.city);
            payload.append('merchant[state]', this.form.merchant.state);
            payload.append('merchant[postal_code]', this.form.merchant.postalcode);
            payload.append('merchant[country]', this.form.merchant.country);

            // If branch address is different
            payload.append('address_same_as_merchant', this.addressSameAsMerchant ? 1 : 0);

            // Branch fields (only if not same as merchant)
            if (!this.addressSameAsMerchant) {
                payload.append('branch[name]', this.form.branch.branch_name);
                payload.append('branch[phone_number]', this.form.branch.phone);
                payload.append('branch[address_line1]', this.form.branch.address_line_1);
                payload.append('branch[city]', this.form.branch.city);
                payload.append('branch[state]', this.form.branch.state);
                payload.append('branch[postal_code]', this.form.branch.postalcode);
                payload.append('branch[country]', this.form.branch.country);
            }
            try {
                const result = await register(payload);
                if(result.status && result.status === true){
                    showSwal.methods.showSwal({
                        type: "success",
                        message: "Successfully Registered!",
                        width: 500
                    });
                    setTimeout(() => {
                        this.$router.push('/login'); // or window.location.href = '/login';
                    }, 1500); // Adjust the delay to match your alert duration
                }
                } catch (err) {
                if (err.type === 'validation') {
                    this.errorHtml = err.html;
                } else {
                    console.error('Unexpected error:', err);
                }
            }
        },
        async validateStepOne() {

            const result = await this.formRef?.validate();

            if (result.valid) {
                if (this.step === 4) {
                    this.handleSignup();
                } else {
                    this.step++;
                }
            }
        },
        prevStep() {
            if (this.step > 1) this.step--
        },
        handleSameAddressCheckbox(event) {
            this.address_same_merchant = event.target.checked;

            if (this.address_same_merchant) {
                this.form.branch.address_line_1 = this.form.merchant.address_line_1;
                this.form.branch.city = this.form.merchant.city;
                this.form.branch.state = this.form.merchant.state;
                this.form.branch.postalcode = this.form.merchant.postalcode;
                this.form.branch.country = this.form.merchant.country;
            } else {
                // Optional: clear branch address if unchecked
                this.form.branch.address_line_1 = '';
                this.form.branch.city = '';
                this.form.branch.state = '';
                this.form.branch.postalcode = '';
                this.form.branch.country = '';
            }
        },

    },
};
</script>

<style scoped>
.input-container {
    width: 70%;
    margin: auto;
}

p {
    color: grey
}

.container-fluid {
    background-color: white;

}

#msform {
    text-align: center;
    position: relative;
    margin-top: 20px
}

#msform fieldset {
    background: white;
    border: 0 none;
    border-radius: 0.5rem;
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    padding-bottom: 20px;
    position: relative
}

.form-card-reg {
    text-align: left
}

#msform fieldset:not(:first-of-type) {
    display: none
}

#msform input,
#msform textarea {
    padding: 8px 15px 8px 15px;
    border: 1px solid #ccc;
    border-radius: 0px;
    margin-bottom: 25px;
    margin-top: 2px;
    width: 100%;
    box-sizing: border-box;
    font-family: montserrat;
    color: #2C3E50;
    background-color: #ECEFF1;
    font-size: 16px;
    letter-spacing: 1px
}

#msform input:focus,
#msform textarea:focus {
    -moz-box-shadow: none !important;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
    border: 1px solid var(--input-pixi-border-color);
    outline-width: 0
}

.heading {
    color: #2C3E50;
}

#msform .action-button {
    width: 100px;
    background: var(--input-pixi-border-color);
    font-weight: bold;
    color: white;
    border: 0 none;
    border-radius: 0px;
    cursor: pointer;
    padding: 10px 5px;
    margin: 10px 0px 10px 5px;
    float: right
}

#msform .action-button:hover,
#msform .action-button:focus {
    background-color: #311B92
}

#msform .action-button-previous {
    width: 100px;
    background: #616161;
    font-weight: bold;
    color: white;
    border: 0 none;
    border-radius: 0px;
    cursor: pointer;
    padding: 10px 5px;
    margin: 10px 5px 10px 0px;
    float: right
}

#msform .action-button-previous:hover,
#msform .action-button-previous:focus {
    background-color: #000000
}

.card-reg {
    z-index: 0;
    border: none;
    position: relative
}

.fs-title {
    font-size: 25px;
    color: var(--input-pixi-border-color);
    margin-bottom: 15px;
    font-weight: normal;
    text-align: left
}

.purple-text {
    color: var(--input-pixi-border-color);
    font-weight: normal
}

.reg-steps {
    font-size: 25px;
    color: gray;
    margin-bottom: 10px;
    font-weight: normal;
    text-align: right
}

.fieldlabels {
    color: gray;
    text-align: left
}

#progressbar {
    margin-bottom: 30px;
    overflow: hidden;
    color: lightgrey
}

#progressbar .active {
    color: green
}

#progressbar li {
    list-style-type: none;
    font-size: 15px;
    width: 25%;
    float: left;
    position: relative;
    font-weight: 100;
    text-align: center;
}

#progressbar #user:before {
    font-family: FontAwesome;
    content: "\f007"
}

#progressbar #merchant:before {
    font-family: FontAwesome;
    content: "\f508"
}

#progressbar #branch:before {
    font-family: FontAwesome;
    content: "\f54e"
}

#progressbar #finish:before {
    font-family: FontAwesome;
    content: "\f00c"
}

#progressbar li:before {
    width: 30px;
    height: 30px;
    line-height: 25px;
    display: block;
    font-size: 15px;
    color: #ffffff;
    background: lightgray;
    border-radius: 50%;
    margin: 0 auto 10px auto;
    padding: 2px;
    text-align: center;
}

#progressbar li:after {
    content: '';
    width: 100%;
    height: 1px;
    background: lightgray;
    position: absolute;
    left: 0;
    top: 15px;
    z-index: -1
}

#progressbar li.active:before,
#progressbar li.active:after {
    background: var(--input-pixi-border-color)
}

.progress {
    height: 10px;
    border-radius: .25rem;
}

.progress-bar {
    background-color: var(--input-pixi-border-color);
    height: auto !important;
}

.fit-image {
    width: 100%;
    object-fit: cover
}

.custom-button {
    background-color: var(--input-pixi-border-color);
    color: white;
    border: none;
    padding: 12px 24px;
    font-size: 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.custom-button:hover {
    background-color: #357ABD;
}
</style>
