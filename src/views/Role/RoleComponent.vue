<template>
    <!-- {{ res }} -->
    <table class="table align-items-center mb-0">
        <thead>
            <tr>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('message.name') }}</th>
              
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">{{ $t('message.status') }}</th>
                <!-- <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status -->
                <!-- </th> -->
                <th class="text-secondary opacity-7">{{ $t('message.actions') }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(each_role, index) in role" :key="index">
                <td>
                    <div class="d-flex px-2 py-1">
                        <!-- <div>
                            <img :src="user.image" class="avatar avatar-sm me-3 border-radius-lg" :alt="user.name" />
                        </div> -->
                        <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">{{ each_role.name }}</h6>
                           
                        </div>
                    </div>
                </td>
                
                <td class="align-middle text-center text-sm">
                    <!-- <span
                        :class="['badge', 'badge-sm', each_role.active === true ? 'bg-gradient-success' : 'bg-gradient-secondary']">
                        {{ each_role.active ? 'Active' : 'Inactive' }}
                    </span> -->
                    <material-switch :id="'toggle_'+each_role.id" name="Toggle" :checked="each_role.active"
                        @change="onToggle(each_role)">
                        {{ each_role.active ?  $t('message.active')  :  $t('message.inactive')  }}
                    </material-switch>
                </td>
                <!-- <td class="align-middle text-center">
                    <span class="text-secondary text-xs font-weight-bold">date</span>
                </td> -->
                <td class="align-middle">
                    <div class="d-flex gap-4">
                        <a href="javascript:;" class="text-secondary font-weight-bold text-xs"
                            @click="editRole(each_role)" title="Edit Role">
                            <i class="material-icons-round opacity-10 fs-5">edit</i>
                        </a>
                        <a href="javascript:;" class="text-secondary font-weight-bold text-xs "
                            @click="tryToDelete(each_role)" title="Delete">
                            <i class="material-icons-round opacity-10 fs-5">delete</i>
                        </a>
                        <a href="javascript:;" class="text-secondary font-weight-bold text-xs "
                            @click="editRole(each_role)" title="View Permissions">
                            <i class="material-icons-round opacity-10 fs-5">visibility</i>
                        </a>

                    </div>

                </td>
            </tr>
            <tr v-if="loading"><td colspan="4"><PulseLoader /></td></tr>
        </tbody>
    </table>

    <OffCanvas :toggle="toggleOffCanvasMenu" :class="[showOffCanvas ? 'show' : '', hideConfigButton ? 'd-none' : '']"
        :closable="true" :title="'Edit Role'" :id="'edit_role'">
        <EditViewRoleComponent :role="selectedRole" v-if="selectedRole != null"></EditViewRoleComponent>
    </OffCanvas>

    <PaginationComponent :currentPage="pagination.current_page" :totalPages="pagination.last_page"
        @page-changed="loadRoles" />
    <ConfirmModal ref="confirmModal" title="Delete Item"
        :message="`Are you sure you want to delete ${selectedRole?.name}?`" confirmText="Yes, Delete" />

</template>

<script>
import { mapMutations, mapState } from "vuex";
import OffCanvas from "@/components/OffCanvas.vue";
import EditViewRoleComponent from "./EditViewRoleComponent.vue";
import PaginationComponent from "../components/PaginationComponent.vue";
import { fetchRoles, deleteRole, toggleStatus } from "@/utils/role_services";
import showSwal from "@/mixins/showSwal.js";
import ConfirmModal from "@/views/components/ConfirmModal.vue";
import MaterialSwitch from "@/components/MaterialSwitch.vue";
import PulseLoader from "../PulseLoader.vue";

export default {
    name: "RoleComponent",
    components: {
        OffCanvas,
        PaginationComponent,
        EditViewRoleComponent,
        ConfirmModal,
        MaterialSwitch,
        PulseLoader
    },
    data() {
        return {
            role: {},
            res: {},
            loading:false,
            selectedRole: null,
            pagination: {
                current_page: 1,
                last_page: 1,
                per_page: 10,
                total: 0
            }
        };
    },
    async mounted() {
        this.loadRoles();

    },
    methods: {
        editRole(selected_role) {
            sessionStorage.setItem('selectedRole', JSON.stringify(selected_role));
            this.$router.push({ 
                path: "/create-role",
                query: { edit: 'on' }
            });
      },
        async onToggle(role) {
            try {
                role.active = !role.active;
                const formData = new FormData();
                formData.append('active', role.active ? 1 : 0);
                formData.append('inactive_reason', role.active ? null : "Deactivated by Admin");

                await toggleStatus(role.id, formData);
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
            this.selectedRole = item;

             let confirmed = await showSwal.methods.showSwalConfirmationDelete();

            if (confirmed.isConfirmed) {
                try {
                    await deleteRole(this.selectedRole.id);
                    showSwal.methods.showSwal({
                        type: "success",
                        message: "Role deleted successfully!",
                        width: 500
                    });
                    this.loadRoles();
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
        openOffCanvasMenu(role) {
            this.toggleOffCanvasMenu();
            this.selectedRole = role;
        },
        async loadRoles(page = 1) {
            this.loading = true;
            try {
                let response = await fetchRoles(page);
                this.res = response.data;
                this.role = response.data.data.data;
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