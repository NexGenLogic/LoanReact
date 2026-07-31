<template>
    <div>
        <!--  Custom content inside the slot -->
        <div class="mt-2">
            <material-input id="text" label="Name" :value="user.name" />
        </div>

        <div class="mt-5">
            <material-input id="text" label="Email" :value="user.email" />
        </div>

        <div class="button-row d-flex mt-4">
            <material-button type="button" color="dark" variant="gradient"
                class="ms-auto mb-0 js-btn-next">Submit</material-button>
        </div>
    </div>
</template>
<script>
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";
export default {
    name: "user-edit",
    components: {
        MaterialInput,
        MaterialButton
    },
    props: {
        user: {
            type: Object,
            required: true
        }
    }
}
</script>