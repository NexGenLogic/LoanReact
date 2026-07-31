import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
// import MainCategories from "../views/Maincategories.vue";
import Billing from "../views/Billing.vue";
// import RTL from "../views/Rtl.vue";
import Notifications from "../views/Notifications.vue";
import Profile from "../views/Profile.vue";
import SignIn from "../views/SignIn.vue";
// import SignUp from "../views/SignUp.vue";
import Login from "../views/Login.vue";
// import Signup from "../views/Signup.vue";
import PasswordForgot from "../views/examples-api/PasswordForgot.vue";
import PasswordReset from "../views/examples-api/PasswordReset.vue";
import UserProfile from "../views/profile/UserProfile.vue";
// import Users from "../views/examples-api/users/UsersList.vue";
import PermissionList from "@/views/permissions/PermissionList.vue";
// import MainCategories from "../views/Maincategories.vue";
import AppRegister from "../views/Register.vue";
import NotFound from "../views/NotFound.vue";
// import RoleApp from "../views/RoleApp.vue";
import TermsAndConditions from "../views/TermsAndConditions.vue";
import RoleList from "../views/Role/RoleList.vue";
import CreateRole from "../views/Role/CreateRole.vue";
import EmployeeList from "../views/Employees/EmployeeList.vue";
import CreateEmployee from "../views/Employees/CreateEmployee.vue";
import CustomerList from "../views/Customers/CustomerList.vue";
import CreateCustomer from "../views/Customers/CreateCustomer.vue";
import LoanList from "../views/Loan/LoanList.vue";
import CreateLoan from "../views/Loan/CreateLoan.vue"
import InvestorList from "../views/Investors/InvestorList.vue"
import CreateInvestor from "../views/Investors/CreateInvestor.vue";
import LoanUpdateList from "../views/Loan/LoanUpdateList.vue";
import ViewUpdatedLoanDetails from "../views/Loan/ViewUpdatedLoanDetails.vue";
import InvestmentList from "../views/Investments/InvestmentList.vue";
import CreateInvestment from "../views/Investments/CreateInvestment.vue";
import AnalyticsReport from "../views/Analytics/AnalyticsReport.vue"
import CustomerDashboard from "../views/CustomerDashboard.vue";
import InvestorDashboard from "../views/InvestorDashboard.vue";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/login",
  },

  {
    path: "/register",
    name: "Register",
    component: AppRegister,
    meta: { user_type: 'merchant' }
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { user_type: 'merchant' }
  },
    {
    path: "/customer-dashboard",
    name: "Customer Dashboard",
    component: CustomerDashboard,
    meta: { user_type: 'customer' }
  },
  {
    path: "/investor-dashboard",
    name: "Investor Dashboard",
    component: InvestorDashboard,
    meta: { user_type: 'customer' }
  },
  { 
    path: "/tems-conditions",
    name: "Terms Conditions",
    component: TermsAndConditions,
    meta: { user_type: 'merchant' }
  },
  {
    path: "/billing",
    name: "Billing",
    component: Billing,
    meta: { user_type: 'merchant' }
  },
  {
    path: "/roles",
    name: "Roles",
    // component: RoleApp,
    component : RoleList,
    meta: { user_type: 'merchant' }
  },
    {
    path: "/create-role",
    name: "Create Role",
    // component: RoleApp,
    component : CreateRole,
    meta: { user_type: 'admin' }
  },
  {
    path: "/notifications",
    name: "Notifications",
    component: Notifications,
    meta: { user_type: 'merchant' }
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { user_type: 'merchant' }
  },
  {
    path: "/sign-in",
    name: "SignIn",
    component: SignIn,
    meta: { user_type: 'merchant' }
  },
  {
    path: "/admin/login",
    name: "admin.login",
    component: Login,
    meta: { user_type: 'admin' }
  },
  {
    path: "/login",
    name: "merchant.login",
    component: Login,
    meta: { user_type: 'merchant' }
  },

  {
    path: "/signup",
    name: "Signup",
    component: AppRegister,
    meta: { user_type: 'merchant' }
  },
  {
    path: "/password-forgot",
    name: "Password Forgot",
    component: PasswordForgot,
    meta: { user_type: 'merchant' }
  },
  {
    path: "/password-reset",
    name: "Password Reset",
    component: PasswordReset,
    meta: { user_type: 'merchant' }
  },
  {
    path: "/user-profile",
    name: "User Profile",
    component: UserProfile,
    meta: { user_type: 'merchant' }
  },
  {
    path: '/permissions',
    name: "Permissions",
    component: PermissionList,
    meta: { user_type: 'admin' }
  },
  {
    path: '/employees',
    name: "Employees",
    component: EmployeeList,
    meta: { user_type: 'admin' }
  },
    {
    path: '/create-employee',
    name: "CreateEmployee",
    component: CreateEmployee,
    meta: { user_type: 'user' }
  },
  {
    path: '/customers',
    name: "Customers",
    component: CustomerList,
    meta: { user_type: 'user' }
  },
  {
    path: '/create-customer',
    name: "CreateCustomer",
    component: CreateCustomer,
    meta: { user_type: 'user' }
  },
  {
    path: '/loans',
    name: "Loans",
    component: LoanList,
    meta: { user_type: 'user' }
  },
  {
    path: '/update-list',
    name: "Loan Updates",
    component: LoanUpdateList,
    meta: { user_type: 'user' }
  },
  {
    path: '/create-loan',
    name: "CreateLoan",
    component: CreateLoan,
    meta: { user_type: 'user' }
  },
  {
    path: '/loans/edit/:loanId',
    name: 'Loan Edit',
    component: CreateLoan,
    props: true  // to pass route params as props
  },
  {
    path: '/loans/edit/:loanId',
    name: 'View Updated Loan',
    component: ViewUpdatedLoanDetails,
    props: true  // to pass route params as props
  },
  {
    path: '/investors',
    name: "Investors",
    component: InvestorList,
    meta: { user_type: 'user' }
  },
  {
    path: '/investments',
    name: "Investments",
    component: InvestmentList,
    meta: { user_type: 'user' }
  },
  {
    path: '/create-investment',
    name: "CreateInvestment",
    component: CreateInvestment,
    meta: { user_type: 'user' }
  },
  {
    path: '/investments/edit/:investmentId',
    name: 'Investment Edit',
    component: CreateInvestment,
    props: true  // to pass route params as props
  },
  {
    path: '/create-investor',
    name: "CreateInvestor",
    component: CreateInvestor,
    meta: { user_type: 'user' }
  },
  {
    path: '/analytics',
    name: "Analytics",
    component: AnalyticsReport,
    meta: { user_type: 'user' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: NotFound,
    meta: { user_type: 'merchant' }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/signup', '/sign-up', '/password-forgot', '/password-reset', '/', '/home','/register','/tems-conditions'];
  const authRequired = !publicPages.includes(to.path);
  const token = localStorage.getItem('access_token');

  if (authRequired && !token) {
    return next(to.meta.user_type === 'admin' ? '/login' : '/login');
  }

  next();
});
export default router;
