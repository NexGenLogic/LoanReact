<template>
    <div>
        <div v-if="!investor || investor.length === 0 && !loading" class="text-center p-5">
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
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">ID</th>
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Address</th>
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Amount</th>
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Created By</th>
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Status</th>
                        <th class="text-secondary opacity-7" v-if="is_allowed('investors','update')">{{ $t('message.actions') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(each_investor, index) in investor" :key="index">
                        <td>
                            <div class="d-flex px-2 py-1">
                                <div>
                                    <img :src="each_investor.image" class="avatar avatar-sm me-3 border-radius-lg"
                                        :alt="each_investor.name" v-if="each_investor.image" />
                                    <i v-else class="material-icons-round opacity-10 fs-5 me-2">person</i>
                                </div>
                                <div class="d-flex flex-column justify-content-center">
                                    <h6 class="mb-0 text-sm">{{ each_investor.name }}</h6>
                                    <p class="text-xs text-secondary mb-0">{{ each_investor.email }}</p>
                                    <p class="text-xs text-secondary mb-0">{{ each_investor.phone_number }}</p>
                                </div>
                            </div>
                        </td>
                        <td class="align-middle text-sm">
                            {{ each_investor?.identifier }}
                        </td>
                        <td class="align-middle text-sm">
                             <div v-if="each_investor.address_line1" style="
                                width: 200px;
                                word-wrap: break-word;
                                overflow-wrap: break-word;
                                white-space: normal;
                            ">
                                {{ each_investor.address_line1 }}<br>
                                <span v-if="each_investor.address_line2">{{ each_investor.address_line2 }}<br></span>
                                {{ each_investor.city }}, {{ each_investor.state }} {{ each_investor.postal_code }}<br>
                                <div class="text-uppercase">{{ each_investor.country }}</div>
                            </div>
                            <div v-else>N/A</div>
                        </td>
                         <td class="align-middle text-sm">
                            {{ each_investor.total_investment_amount ?? '00.00' }}
                        </td>
                        <td class="align-middle text-sm">
                           
                            <div class="d-flex flex-column justify-content-center">
                                    <h6 class="mb-0 text-sm"> {{ each_investor.user.name }}</h6>
                                   <p class="text-xs text-secondary mb-0">{{ formatDate(each_investor.created_at) }}</p>
                                </div>
                        </td>
                        <td class="align-middle text-sm">
                        <span class="badge badge-sm" :class="['bg-gradient-' + statusBadges[each_investor.status]]">
                            {{ statusLabels[each_investor.status] || each_investor.status }}
                        </span>
                        <div v-if="each_investor.inactive_reason " class="inactive-reason text-muted mt-1" style="font-size: 0.85em;">
                            <span
                            class="text-truncate"
                            :title="each_investor.inactive_reason"
                            style="max-width: 120px; display: inline-block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; vertical-align: bottom; cursor: pointer;"
                            >
                            {{ each_investor.inactive_reason }}
                            </span>
                        </div>
                        </td>

                        <!-- <td class="align-middle text-center text-sm" >
                           
                        </td> -->
                        <td class="align-middle" >
                            <div class="d-flex gap-4">
                                <a href="javascript:;" class="text-secondary font-weight-bold text-xs"
                                    @click="openOffCanvasMenu(each_investor)" title="Edit Investor">
                                    <i class="material-icons-round opacity-10 fs-5">edit</i>
                                </a>
                                 <a href="javascript:;" @click="openStatusModal(each_investor)" title="Change Detailed Status" v-if="isAdmin()">
                                    <i class="material-icons-round opacity-10 fs-5 text-info">published_with_changes</i>
                                </a>
                                <a href="javascript:;" class="text-secondary font-weight-bold text-xs "
                                    @click="tryToDelete(each_investor)" title="Delete"  v-if="is_allowed('investors','delete')">
                                    <i class="material-icons-round opacity-10 fs-5">delete</i>
                                </a>
                                 <material-switch :id="'toggle_'+each_investor.id" name="Toggle"
                                    :checked="each_investor.active" @change="onToggle(each_investor)" v-if="is_allowed('investors','update')">
                                    <!-- {{ each_investor.active ? $t('message.active') : $t('message.inactive') }} -->
                                </material-switch>
                               
                                 <!-- <a href="javascript:;" class="text-secondary font-weight-bold text-xs "
                                    @click="openaddInvestmentModal(each_investor)" title="Add Investment">
                                    <i class="material-icons-round opacity-10 fs-5">savings</i>
                                </a>
                                 <a href="javascript:;" class="text-secondary font-weight-bold text-xs"
                                    @click="openInvestmentSummary(each_investor)" title="Investment Summary">
                                    <i class="material-icons-round opacity-10 fs-5">monetization_on</i>
                                </a> -->
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
                <BaseModal ref="addInvestmentModal" modal-id="investmentModal" size="md">
                <template #header>
                    <h5 class="modal-title">Add Investment</h5>
                    <button type="button" class="btn-close" @click="closeaddInvestmentModal" aria-label="Close"></button>
                </template>
                <AddInvestmentPopup ref="investmentForm"  @payment_submit="handleInvestment" />
                <template #footer>
                    <button type="button" class="btn btn-secondary" @click="closeaddInvestmentModal">Cancel</button>
                    <button type="button" class="btn btn-success" @click="investmentPoker" :disabled="loading">
                        <span v-if="loading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        {{ loading ? 'Saving...' : 'Save' }}
                    </button>
                </template>
            </BaseModal>

            <OffCanvas
                ref="investmentSummaryOffCanvas"
                :toggle="toggleInvestmentSummary"
                :class="[showInvestmentSummary ? 'show' : '']"
                :closable="true"
                :title="'Investment Summary'"
                :id="'investment_summary'">
                <InvestmentSummaryView  v-if="selectedSummaryInvestor" :investor="selectedSummaryInvestor" />
            </OffCanvas>
            <OffCanvas :toggle="toggleOffCanvasMenu" :class="[showOffCanvas ? 'show' : '', hideConfigButton ? 'd-none' : '']"
                :closable="true" :title="'Edit Investor'" :id="'edit_store'">
                <EditViewInvestorComponent :investor="selectedInvestor" v-if="selectedInvestor != null"
                    @investor-updated="fetchInvestors_1"></EditViewInvestorComponent>
            </OffCanvas>
            <ChangeInvestorStatusModal ref="investorStatusModal" :investor="selectedInvestor" @status-updated="onStatusUpdated" />
            <PaginationComponent :currentPage="pagination.current_page" :totalPages="pagination.last_page"
                @page-changed="loadInvestors" />
        </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import OffCanvas from "@/components/OffCanvas.vue";
import EditViewInvestorComponent from "./EditViewInvestorComponent.vue";
import PaginationComponent from "../components/PaginationComponent.vue";
import { fetchInvestors, deleteInvestor, toggleStatus, submitInvestment } from "@/utils/investor_services";
import showSwal from "@/mixins/showSwal.js";
import MaterialSwitch from "@/components/MaterialSwitch.vue";
import PulseLoader from "../PulseLoader.vue";
import noDataImage from "@/assets/img/nodata.png";
import { is_allowed,isAdmin } from "@/utils/api_services"; 
import AddInvestmentPopup from "./AddInvestmentPopup.vue";
import BaseModal from '@/views/components/BaseModal.vue';
import InvestmentSummaryView from "./InvestmentSummaryView.vue"; 
import ChangeInvestorStatusModal from "../components/ChangeInvestorStatusModal.vue";

export default {
    name: "InvestorComponent",
    components: {
        OffCanvas,
        PaginationComponent,
        EditViewInvestorComponent,
        MaterialSwitch,
        PulseLoader,
        AddInvestmentPopup,
        BaseModal,
        InvestmentSummaryView,
        ChangeInvestorStatusModal
    },
    props: {
        search_obj: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            showInvestmentSummary: false,
            selectedSummaryInvestor: null,
            noDataImage,
            investor: [],
            
            res: {},
            loading: false,
            selectedInvestor: null,
            pagination: {
                current_page: 1,
                last_page: 1,
                per_page: 10,
                total: 0
            },
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
        };
    },
    watch: {
        search_obj() {
            this.investor = [];
            this.loadInvestors(1);
        }
    },
    async mounted() {
        this.loadInvestors();
    },
    methods: {
        isAdmin,
        onStatusUpdated() {
            showSwal.methods.showSwal({
                type: "success",
                message: "Investor status updated successfully!",
                width: 500
            });
            this.loadInvestors(this.pagination.current_page);
        },
        openStatusModal(investor) {
            this.selectedInvestor = investor;
            this.$nextTick(() => {
                this.$refs.investorStatusModal.show();
            });
            },
    formatDate(dateString) {
            if (!dateString) {
                return "N/A";
            }
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            return new Date(dateString).toLocaleDateString('en-US', options);
        },
        openInvestmentSummary(investor) {
            this.selectedSummaryInvestor = investor;
            this.showInvestmentSummary = true;
        },

        toggleInvestmentSummary() {
            this.showInvestmentSummary = false;
            this.selectedSummaryInvestor = null;
        },
        investmentPoker() { this.$refs.investmentForm.submit(); },
        openaddInvestmentModal(investor) {
            this.$refs.addInvestmentModal.show(); 
            this.selectedInvestor = investor;
        },
        async handleInvestment(payment_obj) {
            // this.loading = true;
            try {
                await submitInvestment(this.selectedInvestor?.id, payment_obj);
                // this.loading = false;
                showSwal.methods.showSwal({
                    type: "success",
                    message: "Loan payment successful!",
                    width: 500
                });
                this.closeaddInvestmentModal();
                
                console.log(payment_obj)
            } catch (error) {
                this.loading = false;
                console.error(error);
            }
        },
         closeaddInvestmentModal() { this.$refs.addInvestmentModal.close(); },
        is_allowed,
        downloadData() {
            if (!this.investor || this.investor.length === 0) {
                showSwal.methods.showSwal({
                    type: "error",
                    message: "No investor data to download.",
                    width: 500
                });
                return;
            }

            // 1. Define CSV headers
            const headers = ['Name', 'Email', 'Phone', 'Address', 'Status'];

            // 2. Map investor data to CSV rows
            const rows = this.investor.map(cust => {
                // Combine address fields into a single string, handling null/empty values
                const addressParts = [
                    cust.address_line1,
                    cust.address_line2,
                    cust.city,
                    cust.state,
                    cust.postal_code,
                    cust.country
                ].filter(part => part); // Filter out empty parts
                
                const fullAddress = addressParts.join(', ');

                return [
                    `"${cust.name || ''}"`,
                    `"${cust.email || ''}"`,
                    `"${cust.phone_number || ''}"`,
                    `"${fullAddress}"`, // Add the combined address
                    `"${cust.active ? 'Active' : 'Inactive'}"`
                ];
            });

            // 3. Combine headers and rows
            const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

            // 4. Create a Blob
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

            // 5. Generate timestamped filename
            const timestamp = new Date().toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
            const filename = `investors_${timestamp}.csv`;

            // 6. Create a download link and trigger the download
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        fetchInvestors_1() {
            this.toggleOffCanvasMenu();
            this.loadInvestors();
        },
        async onToggle(investor) {
            try {
                investor.active = !investor.active;
                const formData = new FormData();
                formData.append('active', investor.active ? 1 : 0);
                formData.append('inactive_reason', investor.active ? null : "Deactivated by Admin");
                await toggleStatus(investor.id, formData);
                showSwal.methods.showSwal({
                    type: "success",
                    message: "Status changed successfully!",
                    width: 500
                });
            } catch (err) {
                console.log(err);
            }
        },
        addInvestment(item){
            console.log(item)
        },
        async tryToDelete(item) {
            this.selectedInvestor = item;
            let confirmed = await showSwal.methods.showSwalConfirmationDelete();
            if (confirmed.isConfirmed) {
                try {
                    await deleteInvestor(this.selectedInvestor.id);
                    showSwal.methods.showSwal({
                        type: "success",
                        message: "Investor deleted successfully!",
                        width: 500
                    });
                    this.loadInvestors();
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
        openOffCanvasMenu(investor) {
            this.toggleOffCanvasMenu();
            this.selectedInvestor = investor;
        },
        async loadInvestors(page = 1) {
            this.loading = true;
            try {
                let payload = {
                    status: this.search_obj?.selected_status ?? "",
                    search: this.search_obj?.search_text ?? "",
                    page: page
                };
                let response = await fetchInvestors(payload);
                this.investor = response.data.data.investors.data;
                this.loading = false;
                this.pagination = {
                    current_page: response.data.data.investors.current_page,
                    last_page: response.data.data.investors.last_page,
                    per_page: response.data.data.investors.per_page,
                    total: response.data.data.investors.total
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
