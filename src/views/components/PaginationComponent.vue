<template>
    <div style="width: 100%; display: flex; align-items: flex-end; justify-content: flex-end; margin-top: 16px;">
        <material-pagination>
            <material-pagination-item 
                prev 
                :disabled="currentPage <= 1"
                @click="changePage(currentPage - 1)"
            />
            <material-pagination-item
                v-for="page in totalPages"
                :key="page"
                :label="page"
                :active="page === currentPage"
                @click="changePage(page)"
            />
            <material-pagination-item 
                next 
                :disabled="currentPage >= totalPages"
                @click="changePage(currentPage + 1)"
            />
        </material-pagination>
    </div>
</template>

<script>
import MaterialPagination from "@/components/MaterialPagination.vue";
import MaterialPaginationItem from "@/components/MaterialPaginationItem.vue";

export default {
    name: "pagination-component",
    props: {
        currentPage: {
            type: Number,
            required: true
        },
        totalPages: {
            type: Number,
            required: true
        }
    },
    components: {
        MaterialPagination,
        MaterialPaginationItem
    },
    methods: {
        changePage(page) {
            if (page !== this.currentPage) {
                this.$emit("page-changed", page);
            }
        }
    }
}
</script>
