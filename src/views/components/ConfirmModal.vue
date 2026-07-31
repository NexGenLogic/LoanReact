<template>
    <div
      class="modal fade"
      tabindex="-1"
      aria-labelledby="confirmModalLabel"
      aria-hidden="true"
      ref="confirmModal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title text-white">{{ title }}</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="cancel"
            ></button>
          </div>
          <div class="modal-body">
            <p>{{ message }}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal" @click="cancel">
              Cancel
            </button>
            <button class="btn btn-danger" @click="confirm">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { Modal } from "bootstrap";
  
  export default {
    name: "ConfirmModal",
    props: {
      title: {
        type: String,
        default: "Confirm Action",
      },
      message: {
        type: String,
        default: "Are you sure you want to proceed?",
      },
      confirmText: {
        type: String,
        default: "Yes, Confirm",
      },
    },
    data() {
      return {
        modalInstance: null,
        resolveCallback: null,
      };
    },
    mounted() {
      this.modalInstance = new Modal(this.$refs.confirmModal, {
        backdrop: "static",
        keyboard: false,
      });
    },
    methods: {
      open() {
        this.modalInstance.show();
  
        return new Promise((resolve) => {
          this.resolveCallback = resolve;
        });
      },
      confirm() {
        this.modalInstance.hide();
        if (this.resolveCallback) this.resolveCallback(true);
      },
      cancel() {
        this.modalInstance.hide();
        if (this.resolveCallback) this.resolveCallback(false);
      },
    },
  };
  </script>
  