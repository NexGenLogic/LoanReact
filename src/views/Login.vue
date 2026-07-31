<template>
    <!-- <NavBar btnBackground="bg-gradient-success" /> -->

    <div
  class="page-header align-items-start min-vh-100"
  :style="backgroundStyle"
>
        <!-- <span class="mask bg-gradient-dark opacity-6"></span> -->

        <div class="container mb-6">


            <div class="row">

                <div class="header  w-100  d-flex justify-content-center">
                    <div class="container">
                        <div class="header-body text-center mb-7">
                            <div class="row justify-content-center">


                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4 col-md-8 col-12 mx-auto pb-10">
                    <div class="card z-index-0 fadeIn3 fadeInBottom">
                        <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                            <div
                                class="bg-gradient-success shadow-success border-radius-lg py-3 pe-1 d-flex gap-2 justify-content-center flex-column">
                                <div class="justify-content-center d-flex">
                                    <!-- <img :src="logo" class="navbar-brand-img " alt="main_logo" style="height: 40px;" /> -->
                                </div>
                                <h4 class="text-white font-weight-bolder text-center mt-3 mb-0">
                                    Sign in
                                </h4>

                            </div>
                        </div>
                        <div class="card-body">
                            <AppForm role="form" class="text-start mt-3" :validation-schema="schema"
                                @submit="handleLogin" @invalid-submit="badSubmit">
                                <div class="mb-3">
                                    <material-input-field id="email" v-model:value="user.email" type="email"
                                        label="Email" name="email" variant="static" />
                                </div>
                                <div class="mb-3">
                                    <material-input-field id="password" v-model:value="user.password" type="password"
                                        label="Password" name="password" variant="static" />
                                </div>
                                <material-switch id="rememberMe" name="Remember Me">Remember me</material-switch>
                                <div
                                    style="color:red; font-style: italic;    display: flex;align-items: end;    justify-content: end;">
                                    {{ login_err }}</div>
                                <div class="text-center">
                                    <!-- <material-button class="my-4 mb-2" variant="gradient" color="success" full-width>
                                        <span>Sign in</span>
                                    </material-button> -->
                                    <material-button
                                    class="my-4 mb-2"
                                    variant="gradient"
                                    :color="isLoggingIn ? 'dark' : 'success'"
                                    full-width
                                    :disabled="isLoggingIn"
                                    >
                                    <span v-if="!isLoggingIn">Sign in</span>
                                    <span v-else>
                                        <i class="fa fa-spinner fa-spin me-1"></i> Signing in...
                                    </span>
                                    </material-button>
                                </div>
                                <!-- <p class="mt-4 text-sm text-center">
                                    Don't have an account?
                                    <router-link :to="{ name: 'Signup' }"
                                        class="text-success text-gradient font-weight-bold">Sign
                                        up</router-link>
                                </p>
                                <p class="text-sm text-center">
                                    <router-link :to="{ name: 'Password Forgot' }"
                                        class="text-success text-gradient font-weight-bold">Recover
                                        Password</router-link>
                                </p> -->
                            </AppForm>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>

<script>
// import NavBar from "@/views/PageLayout/Navbar.vue";
import MaterialInputField from "@/components/MaterialInputField.vue";
import MaterialSwitch from "@/components/MaterialSwitch.vue";
import MaterialButton from "@/components/MaterialButton.vue";
// import showSwal from "@/mixins/showSwal";
import { mapMutations } from "vuex";
import { Form as AppForm } from "vee-validate"
import * as Yup from 'yup';
import { login } from "@/utils/api_services";
import logo from "@/assets/img/white_logo.png";
import loginBg from "@/assets/img/background.jpg";

export default {
    name: "AppLogin",
    components: {
        // NavBar,
        MaterialInputField,
        MaterialSwitch,
        MaterialButton,
        AppForm,
    },
    data() {
        return {
            isLoggingIn: false,
            backgroundStyle: {
                backgroundImage: `url(${loginBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            },
            logo,
            login_err: "",
            user: { email: "", password: "" },
            schema: Yup.object().shape({
                email: Yup.string().email("Email has to be a valid email address").required("Email is a required input"),
                password: Yup.string().required("Password is a required input")
            }),
        };
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.loggedIn;
        },
        isAdminRoute() {
            return this.$route.path.includes('admin');
        }
    },
    methods: {
        ...mapMutations(["toggleEveryDisplay", "toggleHideConfig"]),
        async handleLogin(values) {
            this.isLoggingIn = true;
            const baseUrl = process.env.VUE_APP_API_BASE_URL;
            let endpoint = (this.$route.query.admin === '1' || this.$route.path.includes('admin')) 
                        ? '/admin/auth/login' 
                        : '/admin/auth/login';
            let url = `${baseUrl}${endpoint}`;
            try {
                const response = await login(values.email, values.password,url);
                const user = response.data;
                 const user_role = user.role.name
                
                if (response.status === true) {
                    if(user_role == 'Customer') {
                        this.$router.push({ name: 'Customer Dashboard' });
                    }
                    else if(user_role == 'Investor')
                    {
                        this.$router.push({ name: 'Investor Dashboard' });
                    }
                    else {
                        this.$router.push({ name: 'Dashboard' });
                    }
                    
                }
            } catch (error) {
                this.isLoggingIn = false;
                console.log(error);
                if (error.message) {
                    this.login_err = error.message;
                }
            }
        }

    },
};
</script>
