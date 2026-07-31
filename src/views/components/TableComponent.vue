<template>
    <table class="table align-items-center mb-0">
        <thead>
            <tr>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Author</th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Function</th>
                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status</th>
                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Employed
                </th>
                <th class="text-secondary opacity-7"></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(user, index) in users" :key="index">
                <td>
                    <div class="d-flex px-2 py-1">
                        <div>
                            <img :src="user.image" class="avatar avatar-sm me-3 border-radius-lg" :alt="user.name" />
                        </div>
                        <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">{{ user.name }}</h6>
                            <p class="text-xs text-secondary mb-0">{{ user.email }}</p>
                        </div>
                    </div>
                </td>
                <td>
                    <p class="text-xs font-weight-bold mb-0">{{ user.role }}</p>
                    <p class="text-xs text-secondary mb-0">{{ user.department }}</p>
                </td>
                <td class="align-middle text-center text-sm">
                    <span
                        :class="['badge', 'badge-sm', user.status === 'Online' ? 'bg-gradient-success' : 'bg-gradient-secondary']">
                        {{ user.status }}
                    </span>
                </td>
                <td class="align-middle text-center">
                    <span class="text-secondary text-xs font-weight-bold">{{ user.date }}</span>
                </td>
                <td class="align-middle">
                    <a href="javascript:;" class="text-secondary font-weight-bold text-xs"
                        @click="openOffCanvasMenu(user)">
                        Edit
                    </a>
                </td>
            </tr>
        </tbody>
    </table>

    <OffCanvas :toggle="toggleOffCanvasMenu"
        :class="[showOffCanvas ? 'show' : '', hideConfigButton ? 'd-none' : '']"
        :closable="true"
        :title="'Modify Users'"
        :subtitle="'Sub Title'">
        <user-edit :user="selectedUser" v-if="selectedUser != null"></user-edit>
    </OffCanvas>

    <pagination-component></pagination-component>


</template>

<script>
import { mapMutations, mapState } from "vuex";
import OffCanvas from "@/components/OffCanvas.vue";
import UserEdit from "./UserEdit.vue";
import PaginationComponent from "./PaginationComponent.vue";

export default {
    name: "table-component",
    components: {
        OffCanvas,
        UserEdit,
        PaginationComponent
    },
    data() {
        return {
            users: [
                {
                    name: "John Michael",
                    email: "john@creative-tim.com",
                    role: "Manager",
                    department: "Organization",
                    status: "Online",
                    date: "23/04/18",
                    image: require("@/assets/img/team-2.jpg")
                },
                {
                    name: "Alexa Liras",
                    email: "alexa@creative-tim.com",
                    role: "Programator",
                    department: "Developer",
                    status: "Offline",
                    date: "11/01/19",
                    image: require("@/assets/img/team-3.jpg")
                },
                {
                    name: "Laurent Perrier",
                    email: "laurent@creative-tim.com",
                    role: "Executive",
                    department: "Projects",
                    status: "Online",
                    date: "19/09/17",
                    image: require("@/assets/img/team-4.jpg")
                },
                {
                    name: "Michael Levi",
                    email: "michael@creative-tim.com",
                    role: "Programator",
                    department: "Developer",
                    status: "Online",
                    date: "24/12/08",
                    image: require("@/assets/img/team-3.jpg")
                },
                {
                    name: "Richard Gran",
                    email: "richard@creative-tim.com",
                    role: "Manager",
                    department: "Executive",
                    status: "Offline",
                    date: "04/10/21",
                    image: require("@/assets/img/team-2.jpg")
                },
                {
                    name: "Miriam Eric",
                    email: "miriam@creative-tim.com",
                    role: "Programator",
                    department: "Developer",
                    status: "Offline",
                    date: "14/09/20",
                    image: require("@/assets/img/team-4.jpg")
                }
            ],
            selectedUser: null
        };
    },
    methods: {
        ...mapMutations(["toggleOffCanvasMenu"]),
        openOffCanvasMenu(user) {
            this.toggleOffCanvasMenu();
            this.selectedUser = user;
        }
    },
    computed: {
        ...mapState(["isRTL", "showOffCanvas", "hideConfigButton"])
    }
};
</script>