<template>
    <div class="py-4 container-fluid">
        <div class="mt-4 user">
            <div class="col-12">
                <div class="card">
                    <!-- Card header -->
                    <div class="card-header border-bottom">
                        <div class="user d-flex align-items-center">
                            <div class="col-6">
                                <h6 class="text-capitalize ps-3">{{ $t('message.permissions') }}</h6>
                            </div>
                            <div class="col-6 text-end">
                                <material-button class="float-right btn btm-sm" @click="openOffCanvasMenuAdd();add_or_edit='add'">
                                    <i class="fas fa-user-plus me-2"></i>
                                    {{ $t('message.add_permission') }}
                                </material-button>
                            </div>
                        </div>
                    </div>

                    <!-- Card body -->
                    <div class="px-0 pb-0 card-body">

                        <!-- Table -->
                        <table class="table table-flush mt-3">
                            <thead class="thead-light">
                                <tr>
                                    <th> {{ $t('message.name') }}</th>
                                    <th> {{ $t('message.description') }}</th>
                                    <th> {{ $t('message.status') }}</th>
                                    <th class="text-end"> {{ $t('message.actions') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <permission-item-list :permissions="permissions" @toggle-sidebar="toggleSidebar" @delete-confirm="showDeleteConfirm"></permission-item-list>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <OffCanvas :toggle="toggleOffCanvasMenu" :class="[showOffCanvas ? 'show' : '', hideConfigButton ? 'd-none' : '']"
        :closable="true" :title="add_or_edit == 'add' ? $t('message.add_permission') :   $t('message.edit_permission') " :id="'add_edit_permission'" >
        <EditViewPermissionComponent :permission="add_or_edit == 'add' ? {} : selectedPermission"></EditViewPermissionComponent>
    </OffCanvas>

  
    <ConfirmModal ref="confirmModal" title="Delete Item"
        :message="`Are you sure you want to delete ${selectedPermission?.name}?`" confirmText="Yes, Delete" />
</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";
import PermissionItemList from "./PermissionItemList.vue";
import showSwal from "@/mixins/showSwal";
import OffCanvas from "@/components/OffCanvas.vue";
import ConfirmModal from "@/views/components/ConfirmModal.vue";
import {  mapMutations,mapState } from "vuex";
import { deletePermission, fetchPermissions } from "@/utils/permission_services";
import EditViewPermissionComponent from "./EditViewPermissionComponent.vue";


export default {
    name: "PermissionList",
    components: {
        MaterialButton,
        PermissionItemList,
        OffCanvas,
        ConfirmModal,
        EditViewPermissionComponent
    },
    data() {
        return {
            me: {},
            permissions: {},
            res: {},
            add_or_edit :"edit",
            selectedPermission: null,
        }
    },
    async mounted() {
        this.loadPermissions();

    },
    methods: {
        showProMessage() {
            showSwal.methods.showSwal({
                type: "error",
                message: 'This is a PRO feature.',
                width: 500
            });
        },
        toggleSidebar(permission_from_child) {
            this.add_or_edit = 'edit';
            this.selectedPermission = permission_from_child;
            this.toggleOffCanvasMenu();
    },

    async showDeleteConfirm(permission_from_child) {
            
        this.selectedPermission = permission_from_child;
            const confirmed = await this.$refs.confirmModal.open();

            if (confirmed) {
                try {
                    await deletePermission(permission_from_child.id);
                    showSwal.methods.showSwal({
                        type: "success",
                        message: "Branch deleted successfully!",
                        width: 500
                    });
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
        async loadPermissions() {
            try {
                let response = await fetchPermissions();
                this.res = response.data;
                this.permissions = response.data.data;
            } catch (error) {
                showSwal.methods.showSwal({
                    type: "error",
                    message: "Oops, something went wrong!",
                    width: 500
                });
            }
        },
        ...mapMutations(["toggleOffCanvasMenu"]),
        openOffCanvasMenuAdd() {
            this.toggleOffCanvasMenu();
            
        },
    },
    computed: {
        ...mapState(["isRTL", "showOffCanvas", "hideConfigButton"])
    }
};
</script>

<style scoped>
table thead tr th {
    padding-left: 1.5 rem !important;
}
</style>
