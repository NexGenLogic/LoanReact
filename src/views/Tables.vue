<template>
  <CardContainer title="Staffs">
    <table-component />
  </CardContainer>
</template>

<script>
import TableComponent  from './components/TableComponent.vue';
import CardContainer  from './components/CardContainer.vue';
export default {
  name: "AppTables",
  components:{
    TableComponent,
    CardContainer
  }
};
</script>
