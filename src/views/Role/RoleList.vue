<template>
    <CardContainer title="Roles">
      <template #header-extra>
      <material-button
        type="button"
        color="dark"
        class="d-flex  mb-0 js-btn-next  ms-4 me-4"
        @click="createRole"
      >
        <i class="material-icons-round opacity-10 fs-5 me-2">add_circle</i>
        <span class="d-none d-lg-block">{{ $t('message.create_new_role') }}</span>
      </material-button>
    </template>
      <role-component />
    </CardContainer>
    
  </template>
  
  <script>
  import RoleComponent  from './RoleComponent.vue';
  import CardContainer  from '../components/CardContainer.vue';
  // import CardContainer  from '../components/CardContainer.vue';
  import MaterialButton from "@/components/MaterialButton.vue";
  export default {
    name: "RoleList",
    components:{
      RoleComponent,
      CardContainer,
      MaterialButton
    },
    methods: {
      createRole() {
        this.$router.push({ path: "/create-role" });
      }
    }
  };
  </script>
  