<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container">
    <a class="navbar-brand" href="#">Recharge SaaS</a>
    <div class="ms-auto">
        <router-link :to="{ name: 'admin.login' }"
            class="btn btn-outline-light me-2">
            Admin Login
        </router-link>
        <router-link :to="{ name: 'merchant.login' }"
            class="btn btn-outline-light me-2">
            Merchant Login
        </router-link>
      
    </div>
  </div>
</nav>
      <section class="landing-body text-white text-center py-5">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-6 text-md-start">
              <h1 class="display-4 text-white">{{ title }}</h1>
              <p class="lead">{{ subtitle }}</p>
              <button class="btn btn-light btn-lg mt-3">Get Started</button>
            </div>
            <div class="col-md-6">
              <img :src="illustrator_img" class="img-fluid" alt="Recharge Coupons Illustration">
            </div>
          </div>
        </div>
      </section>
  
      <!-- Features Section -->
      <section class="py-5 bg-light">
        <div class="container">
          <h2 class="text-center mb-5">Why Choose Us?</h2>
          <div class="row text-center">
            <div class="col-md-4 mb-4" v-for="feature in features" :key="feature.title">
              <img :src="feature.icon" class="mb-3" width="60" alt="icon">
              <h5>{{ feature.title }}</h5>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Testimonials Section -->
      <section class="py-5">
        <div class="container">
          <h2 class="text-center mb-5">What Our Users Say</h2>
          <div class="row">
            <div class="col-md-6 mb-4" v-for="(testimonial, index) in testimonials" :key="index">
              <div class="card p-3 shadow-sm h-100">
                <p>"{{ testimonial.message }}"</p>
                <div class="d-flex align-items-center mt-3">
                  <img :src="testimonial.avatar" class="rounded-circle me-3" width="50" height="50" alt="user">
                  <div>
                    <strong>{{ testimonial.name }}</strong><br>
                    <small>{{ testimonial.company }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Contact Section -->
      <section class="py-5 bg-light">
        <div class="container">
          <h2 class="text-center mb-4">Contact Us</h2>
          <div class="row justify-content-center">
            <div class="col-md-6">
              <form @submit.prevent="submitContactForm">
                <div class="mb-3">
                  <input type="text" class="form-control" v-model="contact.name" placeholder="Your Name" required />
                </div>
                <div class="mb-3">
                  <input type="email" class="form-control" v-model="contact.email" placeholder="Your Email" required />
                </div>
                <div class="mb-3">
                  <textarea class="form-control" v-model="contact.message" rows="4" placeholder="Your Message" required></textarea>
                </div>
                <button class="btn btn-primary w-100" type="submit">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import { mapMutations } from "vuex";
  import illustrator_img from "@/assets/img/illustrations/couple-chatting-social-media-vector.png";
  export default {
    name: 'LandingPage',
    data() {
      return {
        illustrator_img,
        title: "Sell Recharge Coupons Online",
        subtitle: "A complete SaaS solution to manage and sell recharge vouchers easily and securely.",
        features: [
          {
            icon: "https://cdn-icons-png.flaticon.com/512/2910/2910793.png",
            title: "Instant Delivery",
            description: "Deliver recharge codes instantly to your customers via email or SMS."
          },
          {
            icon: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png",
            title: "User Friendly",
            description: "Simple and clean interface designed for ease of use."
          },
          {
            icon: "https://cdn-icons-png.flaticon.com/512/2910/2910768.png",
            title: "Secure Transactions",
            description: "Your data and payments are safe with our encrypted systems."
          }
        ],
        testimonials: [
          {
            name: "Rahul Sharma",
            company: "RechargeHub.in",
            message: "The easiest way I've found to sell recharge vouchers online!",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg"
          },
          {
            name: "Anita Das",
            company: "CouponKing",
            message: "Super fast, reliable and professional. My customers are happy too.",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg"
          }
        ],
        contact: {
          name: '',
          email: '',
          message: ''
        }
      };
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.loggedIn;
        }
    },
    beforeMount() {
        this.toggleEveryDisplay();
        this.toggleHideConfig();
    },
    beforeUnmount() {
        this.toggleEveryDisplay();
        this.toggleHideConfig();
    },
    methods: {
        ...mapMutations(["toggleEveryDisplay", "toggleHideConfig"]),
      submitContactForm() {
        alert(`Thanks, ${this.contact.name}! We'll reach out to you soon.`);
        this.contact = { name: '', email: '', message: '' };
      }
    }
  };
  </script>
  
  <style scoped>
  .card {
    border-radius: 1rem;
  }
  .landing-body {
    background: linear-gradient(to right, #6a1b9a, #4a148c);
    color: white; /* Optional: for better text contrast */
  }
  </style>
  