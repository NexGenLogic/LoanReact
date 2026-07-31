<!-- components/BaseModal.vue -->
<template>
  <div class="modal fade" ref="modal" tabindex="-1" :id="modalId" aria-hidden="true">
    <div class="modal-dialog" :class="modalSize">
      <div class="modal-content">
        <div class="modal-header bg-success ">
          <slot name="header">
            <h5 class="modal-title " >Default Title</h5>
            <button type="button" class="btn-close" @click="close" aria-label="Close"></button>
          </slot>
        </div>
        <div class="modal-body">
          <slot>
            Default body content.
          </slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <button type="button" class="btn btn-secondary" @click="close">Close</button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as bootstrap from 'bootstrap'; 
export default {
  name: 'BaseModal',
  props: {
    modalId: {
      type: String,
      default: 'baseModal'
    },
    size: {
      type: String,
      default: 'md' // lg, sm, xl
    }
  },
  computed: {
    modalSize() {
      return {
        'modal-sm': this.size === 'sm',
        'modal-lg': this.size === 'lg',
        'modal-xl': this.size === 'xl'
      };
    }
  },
  methods: {
    show() {
      const modal = new bootstrap.Modal(this.$refs.modal);
      modal.show();
    },
    close() {
      const modal = bootstrap.Modal.getInstance(this.$refs.modal);
      modal.hide();
    }
  }
};
</script>

