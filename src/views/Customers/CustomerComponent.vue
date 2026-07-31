<template>
    <div>
        <div v-if="!customer || customer.length === 0 && !loading" class="text-center p-5">
            <img :src="noDataImage" alt="No Data" style="max-width: 300px; opacity: 0.6;" />
        </div>
        <div v-else-if="loading" class="text-center p-5">
            <PulseLoader />
        </div>
        <div v-else>
            <table class="table align-items-center mb-0">
                <thead>
                    <tr>
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Name</th>
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Phone</th>
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Address</th>
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Created By</th>
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Status</th>
                        <th class="text-secondary opacity-7" v-if="is_allowed('customers','update')">{{ $t('message.actions') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(each_customer, index) in customer" :key="index">
                        <td>
                            <div class="d-flex px-2 py-1">
                                <div>
                                    <img :src="each_customer.image" class="avatar avatar-sm me-3 border-radius-lg"
                                        :alt="each_customer.name" v-if="each_customer.image" />
                                    <i v-else class="material-icons-round opacity-10 fs-5 me-2">person</i>
                                </div>
                                <div class="d-flex flex-column justify-content-center">
                                    <h6 class="mb-0 text-sm">{{ each_customer.name }}</h6>
                                    <p class="text-xs text-secondary mb-0">{{ each_customer.email }}</p>
                                    
                                </div>
                            </div>
                        </td>
                        <td class="align-middle text-sm">
                            {{ each_customer.phone_number }}
                        </td>
                        <td class="align-middle text-sm">
                            <div v-if="each_customer.address_line1" style="width: 200px; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">
                                {{ each_customer.address_line1 }}<br>
                                <span v-if="each_customer.address_line2">{{ each_customer.address_line2 }}<br></span>
                                {{ each_customer.city }}, {{ each_customer.state }} {{ each_customer.postal_code }}<br>
                                <div class="text-uppercase">{{ each_customer.country }}</div>
                            </div>
                            <div v-else>N/A</div>
                        </td>
                        <td class="align-middle text-sm">
                            {{ each_customer.user?.name }}
                        </td>
                        <td class="align-middle text-sm">
                            <span class="badge badge-sm" :class="['bg-gradient-' + statusBadges[each_customer.status]]">{{ statusLabels[each_customer.status] || each_customer.status }}</span>
                        </td>
                        <td class="align-middle" v-if="is_allowed('customers','update')">
                            <div class="d-flex align-items-center gap-3">
                                <a href="javascript:;" class="text-secondary font-weight-bold text-xs" @click="openOffCanvasMenu(each_customer)" title="Edit Customer">
                                    <i class="material-icons-round opacity-10 fs-5">edit</i>
                                </a>
                                <a href="javascript:;" @click="openStatusModal(each_customer)" title="Change Detailed Status" v-if="isAdmin()">
                                    <i class="material-icons-round opacity-10 fs-5 text-info">published_with_changes</i>
                                </a>
                                <a href="javascript:;" class="text-secondary font-weight-bold text-xs" @click="tryToDelete(each_customer)" title="Delete">
                                    <i class="material-icons-round opacity-10 fs-5">delete</i>
                                </a>
                                <material-switch 
                                    :id="'toggle_'+each_customer.id" 
                                    name="Toggle"
                                    :checked="each_customer.active" 
                                    @change="onToggle(each_customer)"
                                    title="Quick Active/Inactive Toggle"
                                >
                                </material-switch>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <OffCanvas :toggle="toggleOffCanvasMenu" :class="[showOffCanvas ? 'show' : '', hideConfigButton ? 'd-none' : '']"
                :closable="true" :title="'Edit Customer'" :id="'edit_store'">
                <EditViewCustomerComponent :customer="selectedCustomer" v-if="selectedCustomer != null"
                    @customer-updated="fetchCustomers_1"></EditViewCustomerComponent>
            </OffCanvas>
            <ChangeCustomerStatusModal ref="customerStatusModal" :customer="selectedCustomer" @status-updated="onStatusUpdated" />
            <PaginationComponent :currentPage="pagination.current_page" :totalPages="pagination.last_page"
                @page-changed="loadCustomers" />
        </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import OffCanvas from "@/components/OffCanvas.vue";
import EditViewCustomerComponent from "./EditViewCustomerComponent.vue";
import PaginationComponent from "../components/PaginationComponent.vue";
import ChangeCustomerStatusModal from "../components/ChangeCustomerStatusModal.vue";
import MaterialSwitch from "@/components/MaterialSwitch.vue";
import { fetchCustomers, deleteCustomer, toggleStatus } from "@/utils/customer_services"; 
import showSwal from "@/mixins/showSwal.js";
import PulseLoader from "../PulseLoader.vue";
import noDataImage from "@/assets/img/nodata.png";
import { is_allowed, isAdmin } from "@/utils/api_services";

export default {
    name: "CustomerComponent",
    components: {
        OffCanvas,
        PaginationComponent,
        EditViewCustomerComponent,
        PulseLoader,
        ChangeCustomerStatusModal,
        MaterialSwitch,
    },
    props: {
        search_obj: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            noDataImage,
            statusLabels: {
                pending_approval: 'Pending Approval',
                active: 'Active',
                inactive: 'Inactive',
                blacklisted: 'Blacklisted'
            },
            statusBadges: {
                pending_approval: 'warning',
                active: 'success',
                inactive: 'secondary',
                blacklisted: 'danger'
            },
            customer: [],
            loading: false,
            selectedCustomer: null,
            pagination: {
                current_page: 1,
                last_page: 1,
                per_page: 10,
                total: 0
            }
        };
    },
    watch: {
        search_obj() {
            this.customer = [];
            this.loadCustomers(1);
        }
    },
    async mounted() {
        this.loadCustomers();
    },
    methods: {
        isAdmin,
        is_allowed,
        onStatusUpdated() {
            showSwal.methods.showSwal({
                type: "success",
                message: "Customer status updated successfully!",
                width: 500
            });
            this.loadCustomers(this.pagination.current_page);
        },
        openStatusModal(customer) {
            this.selectedCustomer = customer;
            this.$nextTick(() => {
                this.$refs.customerStatusModal.show();
            });
        },
        async onToggle(customer) {
            try {
                const originalActiveState = customer.active;
                customer.active = !originalActiveState;

                const formData = new FormData();
                formData.append('active', customer.active ? 1 : 0);
                
                await toggleStatus(customer.id, formData);
                    showSwal.methods.showSwal({
                    type: "success",
                    message: "Customer status updated successfully!",
                    width: 500
                });
                this.loadCustomers(this.pagination.current_page);

            } catch (err) {
                customer.active = !customer.active; 
                console.log(err);
                showSwal.methods.showSwal({
                    type: "error",
                    message: "Failed to toggle status.",
                    width: 500
                });
            }
        },
        downloadData() {
            if (!this.customer || this.customer.length === 0) {
                showSwal.methods.showSwal({
                    type: "error",
                    message: "No customer data to download.",
                    width: 500
                });
                return;
            }

            const headers = ['Name', 'Email', 'Phone', 'Address', 'Status'];

            const rows = this.customer.map(cust => {
                const addressParts = [
                    cust.address_line1,
                    cust.address_line2,
                    cust.city,
                    cust.state,
                    cust.postal_code,
                    cust.country
                ].filter(part => part);
                
                const fullAddress = addressParts.join(', ');

                return [
                    `"${cust.name || ''}"`,
                    `"${cust.email || ''}"`,
                    `"${cust.phone_number || ''}"`,
                    `"${fullAddress}"`,
                    `"${this.statusLabels[cust.status] || cust.status}"`
                ];
            });

            const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const timestamp = new Date().toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
            const filename = `customers_${timestamp}.csv`;

            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        fetchCustomers_1() {
            this.toggleOffCanvasMenu();
            this.loadCustomers();
        },
        async tryToDelete(item) {
            this.selectedCustomer = item;
            let confirmed = await showSwal.methods.showSwalConfirmationDelete();
            if (confirmed.isConfirmed) {
                try {
                    await deleteCustomer(this.selectedCustomer.id);
                    showSwal.methods.showSwal({
                        type: "success",
                        message: "Customer deleted successfully!",
                        width: 500
                    });
                    this.loadCustomers();
                } catch (err) {
                    showSwal.methods.showSwal({
                        type: "error",
                        message: "Oops, something went wrong!",
                        width: 500
                    });
                    console.log(err);
                }
            }
        },
        ...mapMutations(["toggleOffCanvasMenu"]),
        openOffCanvasMenu(customer) {
            this.toggleOffCanvasMenu();
            this.selectedCustomer = customer;
        },
        async loadCustomers(page = 1) {
            this.loading = true;
            try {
                let payload = {
                    status: this.search_obj?.selected_status ?? "",
                    search: this.search_obj?.search_text ?? "",
                    page: page
                };
                let response = await fetchCustomers(payload);
                this.customer = response.data.data.customers.data;
                this.loading = false;
                this.pagination = {
                    current_page: response.data.data.customers.current_page,
                    last_page: response.data.data.customers.last_page,
                    per_page: response.data.data.customers.per_page,
                    total: response.data.data.customers.total
                };
            } catch (error) {
                this.loading = false;
                showSwal.methods.showSwal({
                    type: "error",
                    message: "Oops, something went wrong!",
                    width: 500
                });
            }
        },
    },
    computed: {
        ...mapState(["isRTL", "showOffCanvas", "hideConfigButton"])
    }
};
</script>
