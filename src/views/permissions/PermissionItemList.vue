<template>
    <tr v-for="permission in permissions " :key="permission">
        <td class="text-sm font-weight-normal">{{ permission.name }}</td>
        <td class="text-sm font-weight-normal">{{ permission.description }}</td>
        <td class="text-sm font-weight-normal">{{ permission.active ? "Active" : "Inactive" }}</td>
        <td class="text-sm font-weight-normal">
            <div class="text-end">
                <material-button  @click="handleToggleSidebar(permission)"  class="m-1 btn-circle" title="edit" size="sm">
                    <i class="fas fa-pen"></i>
                </material-button>
                <material-button id="delBut" @click="handleDeleteConfirm(permission)" class="m-1 btn-circle" size="sm" color="danger"
                    title="delete">
                    <i class="fas fa-trash"></i>
                </material-button>
            </div>
        </td>
    </tr>
</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";
import showSwal from "@/mixins/showSwal";


export default {
    name: "PermissionItemList",
    components: {
        MaterialButton,
    },
    props: {
        permissions: {
            type: Object,
            required: true
        }
    },
    methods: {
        showProMessage() {
            showSwal.methods.showSwal({
                type: "error",
                message: 'This is a PRO feature.',
                width: 500
            });
        },
        handleToggleSidebar(permission) {
      this.$emit('toggle-sidebar',permission);
    },
    handleDeleteConfirm(permission){
        this.$emit('delete-confirm',permission);
    }
    }
}


</script>

<style scoped>
.btn-circle.btn-sm {
    width: 30px;
    height: 30px;
    padding: 6px 0px;
    border-radius: 15px;
    font-size: 8px;
    text-align: center;
}

table tbody tr td{
  padding-left: 1.5rem !important;
}
</style>