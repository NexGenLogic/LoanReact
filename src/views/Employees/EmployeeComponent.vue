<template>
     <div>
    <div v-if="!employee || employee?.length === 0 && !loading" class="text-center p-5">
      <img :src="noDataImage" alt="No Data" style="max-width: 300px; opacity: 0.6;" />
      <!-- <p class="mt-3 text-secondary fs-6">No Customers available.</p> -->
    </div>
     <div v-else-if="loading" class="text-center p-5">
      <PulseLoader />
    </div>
    <div v-else>
    <table class="table align-items-center mb-0">
        <thead>
            <tr>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Name</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Role</th>
               
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Status</th>
                <!-- <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status -->
                <!-- </th> -->
                <th class="text-secondary opacity-7">{{ $t('message.actions') }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(each_employee, index) in employee" :key="index">
                <td>
                    <div class="d-flex px-2 py-1">
                        <div>
                            <img :src="each_employee.image" class="avatar avatar-sm me-3 border-radius-lg" :alt="each_employee.name" v-if="each_employee.image"/>
                            <i v-else class="material-icons-round opacity-10 fs-5 me-2">person</i>
                        </div>
                        <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">{{ each_employee.name }}</h6>
                            <p class="text-xs text-secondary mb-0">{{ each_employee.email }}</p>
                        </div>
                    </div>
                </td>
                <td >
                    <h6 class="mb-0 text-sm">{{ each_employee.app_role.name }}</h6>

                </td>
                <td class="align-middle text-center text-sm">
                    
                    <material-switch :id="'toggle_'+each_employee.id" name="Toggle" :checked="each_employee.active"
                        @change="onToggle(each_employee)">
                        {{ each_employee.active ?  $t('message.active')  :  $t('message.inactive')  }}
                    </material-switch>
                </td>
             
                <td class="align-middle">
                    <div class="d-flex gap-4">
                        <a href="javascript:;" class="text-secondary font-weight-bold text-xs"
                            @click="openOffCanvasMenu(each_employee)" title="Edit Employee">
                            <i class="material-icons-round opacity-10 fs-5">edit</i>
                        </a>
                        <a href="javascript:;" class="text-secondary font-weight-bold text-xs "
                            @click="tryToDelete(each_employee)" title="Delete">
                            <i class="material-icons-round opacity-10 fs-5">delete</i>
                        </a>
                    </div>

                </td>
            </tr>
            <!-- <tr v-if="!employee || employee.length === 0"> 
                <td colspan="4" class="text-center text-secondary p-4">
                    No Employees available.
                </td>
            </tr>
            <tr v-if="loading"><td colspan="4"><PulseLoader /></td></tr> -->
        </tbody>
    </table>

    <OffCanvas :toggle="toggleOffCanvasMenu" :class="[showOffCanvas ? 'show' : '', hideConfigButton ? 'd-none' : '']"
        :closable="true" :title="'Edit Employee'" :id="'edit_store'">
        <EditViewEmployeeComponent :employee="selectedEmployee" v-if="selectedEmployee != null" @employee-updated="fetchEmployees"></EditViewEmployeeComponent>
    </OffCanvas>

    <PaginationComponent :currentPage="pagination.current_page" :totalPages="pagination.last_page"
        @page-changed="loadEmployees" />

</div>
</div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import OffCanvas from "@/components/OffCanvas.vue";
import EditViewEmployeeComponent from "./EditViewEmployeeComponent.vue";
import PaginationComponent from "../components/PaginationComponent.vue";
import { fetchEmployees, deleteEmployee, toggleStatus } from "@/utils/employee_services";
import showSwal from "@/mixins/showSwal.js";
import MaterialSwitch from "@/components/MaterialSwitch.vue";
import PulseLoader from "../PulseLoader.vue";
import noDataImage from "@/assets/img/nodata.png";

export default {
    name: "EmployeeComponent",
    components: {
        OffCanvas,
        PaginationComponent,
        EditViewEmployeeComponent,
        MaterialSwitch,
        PulseLoader
    },
    props : {
        search_obj : {
            type : Object,
            default : () => {}
        }
    },
    data() {
        return {
            employee: {},
            noDataImage,
            res: {},
            loading:false,
            selectedEmployee: null,
            pagination: {
                current_page: 1,
                last_page: 1,
                per_page: 10,
                total: 0
            }
        };
    },
    watch: {
        // 3. Watch for filter changes to reset the list
        search_obj() { 
            this.employee = {}; // Clear existing cards
            this.loadEmployees(1); // Load first page with new filter
        }
    },
    async mounted() {
        this.loadEmployees();

    },
    methods: {
        fetchEmployees(){
            this.toggleOffCanvasMenu();
            this.loadEmployees();
        },
        async onToggle(employee) {
            try {
                employee.active = !employee.active;
                const formData = new FormData();
                formData.append('active', employee.active ? 1 : 0);
                formData.append('inactive_reason', employee.active ? null : "Deactivated by Admin");

                await toggleStatus(employee.id, formData);
                showSwal.methods.showSwal({
                    type: "success",
                    message: "Status changed successfully!",
                    width: 500
                });
            } catch (err) {
                console.log(err)
            }


        },
        async tryToDelete(item) {
            this.selectedEmployee = item;
            let confirmed = await showSwal.methods.showSwalConfirmationDelete();
            if (confirmed.isConfirmed) {
                try {
                    await deleteEmployee(this.selectedEmployee.id);
                    showSwal.methods.showSwal({
                        type: "success",
                        message: "Staff deleted successfully!",
                        width: 500
                    });
                    this.loadEmployees();
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
        openOffCanvasMenu(employee) {
            this.toggleOffCanvasMenu();
            this.selectedEmployee = employee;
        },
        async loadEmployees(page = 1) {
            
            this.loading = true;
            try {
                let payload = {
                    status: this.search_obj?.selected_status ?? "",
                    search : this.search_obj?.search_text ?? "",
                    page: page 
                };
                
                let response = await fetchEmployees(payload);
                this.employee = response.data.data.users.data;
                this.loading = false;
                this.pagination = {
                    current_page: response.data.data.users.current_page,
                    last_page: response.data.data.users.last_page,
                    per_page: response.data.data.users.per_page,
                    total: response.data.data.users.total
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