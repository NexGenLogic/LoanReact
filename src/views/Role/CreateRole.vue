<template>
  <div class="py-4 container-fluid ">
    <div class="mt-4 user">
      <div class="col-12">
        <div class="card">
          <!-- Card header -->
          <div class="card-header border-bottom">
            <div class="row">
              <div class="col-sm " :class="`${
      isRTL ? 'rtl-text' : 'text-ltr'} `">
                <span>Role</span>
              </div>
              <div class="col-sm" style="display: flex;flex-direction: column;">

                <input type="text" name="role" id="role" class="role-input" v-model="roleName">
                <div v-show="show_error" style="color:red">Role is missing!</div>

              </div>
            </div>
            <div class="row mt-3">
              <div class="col-sm" :class="`${
      isRTL ? 'rtl-text' : 'text-ltr'} `">
                <span>Description</span>
              </div>
              <div class="col-sm" style="display: flex;flex-direction: column;">

                <textarea name="description" id="description" v-model="description" class="role-input"></textarea>
                <div v-show="show_error" style="color:red">Description is missing!</div>

              </div>
            </div>
          </div>
          <div class="px-0 pb-0 card-body py-0">
            <div class="table-responsive">
              <table class="table table-bordered align-middle">
                <thead class="table-light">
                  <tr>
                    <th>Module</th>
                    <th v-for="permission in permissions" :key="permission" class="text-center">{{ permission }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="loading">
                    <td colspan="5">
                      <PulseLoader />
                    </td>
                  </tr>
                  <tr v-for="(modulePerms, module) in module_permissions" :key="module" v-else>
                    <td><strong>{{ module }}</strong></td>
                    <td v-for="permission in permissions" :key="permission" class="text-center">

                      <material-checkbox v-model="selected_permissions[module][permission]"
                        :disabled="!checkIfPermissionExist(modulePerms, permission)"
                        :key="`${module}_${permission}`"></material-checkbox>
                    </td>
                  </tr>
                </tbody>

              </table>
            </div>
            <div class="d-flex justify-content-end  m-5">
              <div class="d-flex flex-column" v-html="permission_error">

              </div>
              <material-button class="float-right btn btm-sm" @click="savePermissions">
                <span v-if="submit_loading === false">{{ $t('message.save') }}</span>
                <PulseLoader v-if="submit_loading === true" text="Saving" text_color="#fff" />
              </material-button>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";
import { fetchPermissions, createRole, updateRole } from "../../utils/role_services";
import showSwal from "@/mixins/showSwal";
import MaterialCheckbox from "@/components/MaterialCheckbox.vue";
import PulseLoader from "../PulseLoader.vue";
  import { mapState } from "vuex";
export default {
  name: "CreateRole",
  components: {
    MaterialButton,
    MaterialCheckbox,
    PulseLoader
  },
  data() {
    return {
      show_error: false,
      module_permissions: {},
      roleName: "",
      permissions: [],
      selected_permissions: {},
      loading: false,
      submit_loading: false,
      description: "",
      permission_error: "",
      currentRolePermissions: null,
      role_id : ""
    };
  },
  async mounted() {
    this.loadPermissions();
    if (this.$route.query?.edit && this.$route.query.edit == 'on') {
      this.currentRolePermissions = JSON.parse(sessionStorage.getItem('selectedRole'));
      this.role_id = this.currentRolePermissions.id;
      this.roleName = this.currentRolePermissions.name;
      this.description = this.currentRolePermissions.description;
      this.populateSelectedPermissions();
    }
  },
    computed: {
      ...mapState(["isRTL"]),
    },
  methods: {
    populateSelectedPermissions() {
      if (!this.currentRolePermissions || !this.currentRolePermissions.role_permissions) return;

      // Reset selected_permissions
      this.selected_permissions = {};

      this.currentRolePermissions.role_permissions.forEach(perm => {
        const moduleName = perm.app_module?.name;
        if (!moduleName) return;

        // Initialize with all permissions set to false
        this.selected_permissions[moduleName] = {
          create: false,
          read: false,
          update: false,
          delete: false,
          export_sales_report: false,
          assign_roles: false,
          manage_permissions: false,
          process_refund: false,
          manage_general_settings: false
        };

        // Apply standard permissions
        this.selected_permissions[moduleName].create = perm.create ?? false;
        this.selected_permissions[moduleName].read = perm.read ?? false;
        this.selected_permissions[moduleName].update = perm.update ?? false;
        this.selected_permissions[moduleName].delete = perm.delete ?? false;

        // Apply custom permissions if available
        if (perm.custom) {
          Object.entries(perm.custom).forEach(([key, value]) => {
            this.selected_permissions[moduleName][key] = value;
          });
        }

      });
      this.fillFalseInNull_selectedPermissions();

    },
    fillFalseInNull_selectedPermissions() {
      for (let module in this.module_permissions) {
        if (!this.selected_permissions[module]) {
          this.selected_permissions[module] = {};
        }

        for (let permission of this.permissions) {
          if (this.selected_permissions[module][permission] === undefined) {
            this.selected_permissions[module][permission] = false;
          }
        }
      }
    },
    checkIfPermissionExist(modulePermissions, permission) {
      return Array.isArray(modulePermissions) && modulePermissions.includes(permission);
    },
    async loadPermissions() {
      this.loading = true;
      try {
        let response = await fetchPermissions();
        this.res = response.data;
        this.module_permissions = response.data.data.module_permissions;
        this.permissions = response.data.data.permissions;
        this.loading = false;
        if (!this.$route.query?.edit && this.$route.query.edit != 'on') {
          for (let module in this.module_permissions) {
            this.selected_permissions[module] = {};
            for (let perm of this.permissions) {
              this.selected_permissions[module][perm] = this.module_permissions[module].includes(perm);
            }
          }
        }
        this.fillFalseInNull_selectedPermissions();
      } catch (error) {
        this.loading = false;
        showSwal.methods.showSwal({
          type: "error",
          message: "Oops, something went wrong!",
          width: 500
        });
      }
    },
    async savePermissions() {
      this.permission_error = "";
      if (!this.roleName) {
        this.show_error = true;
        return false;
      } else {
        this.show_error = false;
      }
      const formData = new FormData();
      formData.append('role', this.roleName);
      formData.append('description', this.description);
      
      // Flatten nested permissions object
      Object.entries(this.selected_permissions).forEach(([module, perms]) => {
        Object.entries(perms).forEach(([perm, value]) => {
          // Only append selected (true) permissions

          if (value) {
            formData.append(`permissions[${module}][]`, perm);
          }
        });
      });
      try {
        this.submit_loading = true;
        if(this.role_id) {
          formData.append('role_id', this.role_id);
          
          await updateRole(formData);
        }else {
          await createRole(formData);
        }
        
        this.$router.push({ 
                path: "/roles"
            });
      } catch (error) {
        this.submit_loading = false;
        if (error.html) {
          this.permission_error = error.html;
        }
      }
      this.submit_loading = false;
    },
  },
};
</script>

<style scoped>
.text-ltr {
  text-align: right;
}

.rtl-text {
  display: flex;
  justify-content: left;
}
input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.role-input {
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 200px;
  padding: 5px;
}

.role-input:focus {
  outline: none;
  border: 2px solid #92d4cb;
}
</style>