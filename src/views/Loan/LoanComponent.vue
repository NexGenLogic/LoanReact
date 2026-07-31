<template>
    <div>
    <div v-if="!loan || loan.length === 0 && !loading" class="text-center p-5">
      <img :src="noDataImage" alt="No Data" style="max-width: 300px; opacity: 0.6;" />
    </div>
     <div v-else-if="loading" class="text-center p-5">
      <PulseLoader />
    </div>
    <div v-else>
    <table class="table align-items-center mb-0">
        <thead>
            <tr>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Loan Id</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Customer</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Amount</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Next Due</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">%</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Status</th>
                <th class="text-secondary opacity-7">{{ $t('message.actions') }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(each_loan, index) in loan" :key="index">
                <td>
                    <div class="d-flex px-2 py-1">
                        <div class="d-flex flex-column justify-content-center w-100">
                            <h6 class="mb-2 text-sm font-weight-bold">{{ each_loan.loan_identifier }}</h6>
                            
                            <!-- Compact info pills with tooltips -->
                            <div class="loan-meta d-flex flex-column gap-1">
                                <div v-if="each_loan.created_by_name" 
                                    class="meta-pill created tooltip-container"
                                    :data-tooltip="`Created by ${each_loan.created_by_name} on ${each_loan.created_at ? new Date(each_loan.created_at).toLocaleDateString() : ''}`">
                                    <span class="pill-icon">👤</span>
                                    <span class="pill-text">{{ each_loan.created_by_name }}</span>
                                </div>
                                
                                <div v-if="each_loan.approved_by_name" 
                                    class="meta-pill approved tooltip-container"
                                    :data-tooltip="`Approved by ${each_loan.approved_by_name} on ${each_loan.approved_at_formatted}`">
                                    <span class="pill-icon">✅</span>
                                    <span class="pill-text">{{ each_loan.approved_by_name }}</span>
                                    <small v-if="each_loan.approved_at_formatted" class="pill-date">
                                        {{ each_loan.approved_at_formatted }}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
                <td class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                    <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">{{ each_loan.customer?.name || 'N/A' }}</h6>
                       
                    </div>
                </td>
                <td class="align-middle  text-sm">{{ each_loan.principal_amount }}</td>
                <td class="align-middle  text-sm">
                    <h6 class="mb-0 text-sm">{{ formatAmount(each_loan.next_due?.amount_due) }}</h6>
                    <p class="text-xs text-secondary mb-0">{{ formatDate(each_loan.next_due?.due_date) }}</p>
                </td>
                <td class="align-middle  text-sm">{{ each_loan.interest_rate }}</td>
                <td class="align-middle text-sm">
                    <span class="badge badge-sm " :class="['bg-gradient-' + statusBadges[each_loan.status]]">{{
                        statusLabels[each_loan.status] || each_loan.status }}</span>
                </td>
                <td class="align-middle">
                    <div class="d-flex gap-4">
                        <a href="javascript:;" class="text-secondary font-weight-bold text-xs"
                            @click="edit_loan(each_loan)" title="Edit Loan" >
                            <i class="material-icons-round opacity-10 fs-5">edit</i>
                        </a>
                        <a v-if="isAdmin()" href="javascript:;" @click="openStatusModal(each_loan)"
                            title="Change Status">
                            <i class="material-icons-round opacity-10 fs-5 text-info">published_with_changes</i>
                        </a>
                        <a href="javascript:;" class="text-secondary font-weight-bold text-xs "
                            @click="tryToDelete(each_loan)" title="Delete" v-if="is_allowed('loans','delete')">
                            <i class="material-icons-round opacity-10 fs-5">delete</i>
                        </a>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    <ChangeStatusModal ref="statusModal" :loan="selectedLoan" @status-updated="onStatusUpdated" v-if="isAdmin()" />
    <PaginationComponent :currentPage="pagination.current_page" :totalPages="pagination.last_page"
        @page-changed="loadLoans" />
</div>
</div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import ChangeStatusModal from '@/views/components/ChangeStatusModal.vue';
import PaginationComponent from "../components/PaginationComponent.vue";
import { fetchLoans, deleteLoan } from "@/utils/loan_services";
import { isAdmin } from "@/utils/api_services";
import showSwal from "@/mixins/showSwal.js";
import PulseLoader from "../PulseLoader.vue";
import noDataImage from "@/assets/img/nodata.png";
import { is_allowed } from "@/utils/api_services"; 

export default {
    name: "LoanComponent",
    components: {
        PaginationComponent,
        ChangeStatusModal,
        PulseLoader
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
                paid_off: 'Paid Off',
                overdue: 'Overdue',
                cancelled: 'Cancelled',
                defaulted: 'Defaulted',
                pending_update_approval : 'Pending Update Approval'
            },
            statusBadges: {
                pending_approval: 'warning',
                active: 'success',
                paid_off: 'info',
                overdue: 'danger',
                cancelled: 'secondary',
                defaulted: 'secondary',
                pending_update_approval :'warning'
            },
            loan: [],
            res: {},
            loading: false,
            selectedLoan: null,
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
            this.loan = [];
            this.loadLoans(1);
        }
    },
    async mounted() {
        this.loadLoans();
    },
    methods: {
        is_allowed,
        downloadData() {
            if (!this.loan || this.loan.length === 0) {
                showSwal.methods.showSwal({
                    type: "error",
                    message: "No loan data to download.",
                    width: 500
                });
                return;
            }

            const headers = [
                'Loan ID', 
                'Customer Name', 
                'Principal Amount', 
                'Interest Rate (%)', 
                'Status', 
                'Next Due Date', 
                'Next Due Amount'
            ];

            const rows = this.loan.map(l => [
                `"${l.loan_identifier || ''}"`,
                `"${l.customer?.name || 'N/A'}"`,
                `"${l.principal_amount || 0}"`,
                `"${l.interest_rate || 0}"`,
                `"${this.statusLabels[l.status] || l.status}"`,
                `"${l.next_due?.due_date ? this.formatDate(l.next_due.due_date) : 'N/A'}"`,
                `"${l.next_due?.amount_due ? 'INR '+l.next_due.amount_due : 'INR 0.00'}"`
            ]);

            const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const timestamp = new Date().toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
            const filename = `loans_${timestamp}.csv`;
            
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        formatDate(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-IN', {
                year: 'numeric', month: 'short', day: '2-digit'
            });
        },
        formatAmount(amount) {
            if (amount == null) return '₹0.00';
            return '₹' + Number(amount).toFixed(2);
        },
        isAdmin,
        openStatusModal(loan) {
            this.selectedLoan = loan;
            this.$nextTick(() => {
                this.$refs.statusModal.show();
            });
        },
        onStatusUpdated() {
            showSwal.methods.showSwal({
                type: "success",
                message: "Loan status updated successfully!",
                width: 500
            });
            this.loadLoans();
        },
        fetchLoans_1() {
            this.toggleOffCanvasMenu();
            this.loadLoans();
        },
        async tryToDelete(item) {
            this.selectedLoan = item;
            let confirmed = await showSwal.methods.showSwalConfirmationDelete();
            if (confirmed.isConfirmed) {
                try {
                    await deleteLoan(this.selectedLoan.id);
                    showSwal.methods.showSwal({
                        type: "success",
                        message: "Loan deleted successfully!",
                        width: 500
                    });
                    this.loadLoans();
                } catch (err) {
                    const errorMessage = err.raw?.response?.data?.message || "Oops, something went wrong!";
                    showSwal.methods.showSwal({
                        type: "error",
                        message: errorMessage,
                        width: errorMessage.length > 50 ? 1000 : 500
                    });
                }
            }
        },
        ...mapMutations(["toggleOffCanvasMenu"]),
        edit_loan(loan) {
            this.$router.push({ name: 'Loan Edit', params: { loanId: loan.id } });
        },
        async loadLoans(page = 1) {
            this.loading = true;
            try {
                let payload = {
                    status: this.search_obj?.selected_status ?? "",
                    search: this.search_obj?.search_text ?? "",
                    page: page
                };
                // Add from_date and to_date if they exist in search_obj
                if (this.search_obj?.from_date) {
                    payload.from_date = this.search_obj.from_date;
                }
                if (this.search_obj?.to_date) {
                    payload.to_date = this.search_obj.to_date;
                }
                let response = await fetchLoans(payload);
                this.loan = response.data.data.data;
                this.loading = false;
                this.pagination = {
                    current_page: response.data.data.current_page,
                    last_page: response.data.data.last_page,
                    per_page: response.data.data.per_page,
                    total: response.data.data.total
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
<style scoped>
.meta-pill {
    display: flex;
    align-items: center;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 11px;
    width: fit-content;
    max-width: 100%;
    cursor: help;
    transition: all 0.2s ease;
}

.meta-pill:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.meta-pill.created {
    background-color: #e6f3ff;
    color: #0066cc;
    border: 1px solid #b3d9ff;
}

.meta-pill.approved {
    background-color: #e8f5e8;
    color: #2d5a3d;
    border: 1px solid #c3e6c3;
}

.pill-icon {
    margin-right: 4px;
    font-size: 10px;
}

.pill-text {
    font-weight: 500;
    margin-right: 6px;
}

.pill-date {
    color: #666;
    font-style: italic;
    margin-left: auto;
}

/* CSS-only tooltip styles */
.tooltip-container {
    position: relative;
}

.tooltip-container::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: white;
    padding: 6px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s, visibility 0.3s;
    z-index: 1000;
    max-width: 200px;
    word-wrap: break-word;
    white-space: normal;
}

.tooltip-container::before {
    content: '';
    position: absolute;
    bottom: 115%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: #333;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s, visibility 0.3s;
    z-index: 1000;
}

.tooltip-container:hover::after,
.tooltip-container:hover::before {
    opacity: 1;
    visibility: visible;
}
</style>