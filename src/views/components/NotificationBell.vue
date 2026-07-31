<template>
  <li class="nav-item dropdown d-flex align-items-center" :class="{ 'ps-2': isRTL, 'pe-2': !isRTL }">
    <a href="#" class="p-0 nav-link lh-1 position-relative" :class="color ? color : 'text-body'"
      id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" @click="toggleDropdown">
      <i class="material-icons cursor-pointer"> notifications </i>
      <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
    </a>
    <ul class="px-2 py-3 dropdown-menu dropdown-menu-end me-sm-n4" :class="{ 'show': isOpen }"
      aria-labelledby="dropdownMenuButton">
      <div v-if="notifications.length === 0" class="no-notifications px-3 py-2 text-center">
        No new notifications
      </div>
      <!-- Wrap each item in a router-link -->
      <li v-for="notification in notifications" :key="notification.id" class="mb-2">
        <router-link 
          :to="notification.data.url || '/'" 
          class="dropdown-item border-radius-md" 
          :class="{'is-unread': !notification.read_at}"
          @click="onNotificationClick"
        >
          <div class="py-1 d-flex">
            <div class="d-flex flex-column justify-content-center">
              <h6 class="mb-1 text-sm font-weight-normal">
                {{ notification.data.message }}
              </h6>
              <p class="mb-0 text-xs text-secondary">
                <i class="fa fa-clock me-1"></i>
                {{ formatTime(notification.created_at) }}
              </p>
            </div>
          </div>
        </router-link>
      </li>
    </ul>
  </li>
</template>

<script>
import { getNotifications, markNotificationsAsRead } from '@/utils/api_services';
import moment from 'moment';
import { mapState } from "vuex";

export default {
  name: "NotificationBell",
  props: {
    user: {
      type: Object,
      required: true,
    },
    color: String,
  },
  data() {
    return {
      isOpen: false,
      notifications: [],
    };
  },
  computed: {
    ...mapState(["isRTL"]),
    unreadCount() {
      if (!this.notifications) return 0;
      return this.notifications.filter(n => !n.read_at).length;
    }
  },
  async created() {
    const token = localStorage.getItem('access_token');
    if (!token || !this.user || !this.user.id) {
        return;
    }

    await this.fetchNotifications();

    window.Echo.private(`App.Models.User.${this.user.id}`)
      .notification((notification) => {
        this.notifications.unshift({
            ...notification,
            id: notification.id || Date.now(),
            created_at: new Date().toISOString(),
            data: { 
              message: notification.message,
              url: notification.url || '/' // Ensure new notifications have a URL
            } 
        });
      });
  },
  methods: {
    onNotificationClick() {
      // This method simply closes the dropdown when a notification is clicked
      this.isOpen = false;
    },
    async fetchNotifications() {
      try {
        const response = await getNotifications();
        this.notifications = response.data;
      } catch (error) {
        console.error("Failed to fetch notifications.", error);
      }
    },
    async toggleDropdown() {
      this.isOpen = !this.isOpen;
      if (this.isOpen && this.unreadCount > 0) {
        await this.markAllAsRead();
      }
    },
    async markAllAsRead() {
      try {
        await markNotificationsAsRead();
        this.notifications.forEach(n => {
            if (!n.read_at) {
                n.read_at = new Date().toISOString();
            }
        });
      } catch (error) {
        console.error("Failed to mark notifications as read.", error);
      }
    },
    formatTime(date) {
      return moment(date).fromNow();
    }
  }
};
</script>

<style scoped>
.notification-badge {
    position: absolute;
    top: 1px; 
    right: -6px; 
    background-color: red;
    color: white;
    border-radius: 50%;
    padding: 1px 5px;
    font-size: 10px;
    font-weight: bold;
    line-height: 1;
}

.is-unread {
    background-color: #f0f2f5;
}
</style>
