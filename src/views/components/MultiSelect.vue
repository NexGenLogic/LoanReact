<template>
    <div class="dropdown w-100 bg-white border-radius-lg p-2" @click="toggleDropdown">
      <!-- Placeholder -->
      <span
        class="position-absolute"
        style="z-index: 999; top: 10px; left: 10px;"
        v-show="showPlaceholder && !selectedIds.length"
      >
        {{ placeholder }}
      </span>

      <!-- Selected badges -->
      <div
        class="form-control d-flex flex-wrap align-items-center position-relative"
        :class="{ 'border-primary': showDropdown }"
        style="min-height: 42px; cursor: text;"
      >
        <span
          v-for="(item, index) in selectedItems"
          :key="index"
          class="multi-select badge bg-gradient-success text-white me-1 mb-1 d-flex align-items-center"
        >
          {{ item.name }}
          <button
            type="button"
            class="btn-close btn-close-white btn-sm ms-1"
            @click.stop="removeItem(item.id)"
          ></button>
        </span>
        <input
          type="text"
          class="border-0 flex-grow-1"
          style="outline: none; min-width: 100px;"
          @focus="showDropdown = true"
          readonly
        />
      </div>

      <!-- Dropdown list -->
      <ul
        class="dropdown-menu w-100 mt-1 show"
        v-show="showDropdown && availableItems.length"
        style="max-height: 200px; overflow-y: auto;"
      >
        <li v-for="item in availableItems" :key="item.id">
          <a class="dropdown-item" href="#" @click.prevent="selectItem(item.id)">
            {{ item.name }}
          </a>
        </li>
      </ul>

      <!-- No options -->
      <div v-show="showDropdown && !availableItems.length" class="dropdown-menu show w-100">
        <span class="dropdown-item disabled">No options available</span>
      </div>
    </div>
</template>

<script>
export default {
  name: 'MultiSelect',
  props: {
    options: {
      type: Array,
      default: () => [] // [{ id: 1, name: 'Admin' }, ...]
    },
    placeholder: {
      type: String,
      default: 'Select an option'
    },
    modelValue: {
      type: Array,
      default: () => [] // selected IDs
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      showDropdown: false,
    };
  },
  computed: {
    selectedIds() {
      return this.modelValue;
    },
    // Internal computed property to safely handle the options prop
    _safeOptions() {
      if (!Array.isArray(this.options)) {
        // Log a warning to help debug if the options prop is not an array
        console.warn(
          `[MultiSelect] 'options' prop expects an Array, but received ${typeof this.options}. Value:`,
          this.options,
          'Using an empty array as a fallback.'
        );
        return []; // Fallback to an empty array
      }
      return this.options;
    },
    selectedItems() {
      // Use the _safeOptions computed property
      return this._safeOptions.filter(option => this.selectedIds.includes(option.id));
    },
    availableItems() {
      // Use the _safeOptions computed property
      return this._safeOptions.filter(option => !this.selectedIds.includes(option.id));
    },
    showPlaceholder() {
      return this.selectedIds.length === 0;
    }
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = true;
    },
    selectItem(id) {
      if (!this.selectedIds.includes(id)) {
        this.$emit('update:modelValue', [...this.selectedIds, id]);
      }
      // Consider keeping dropdown open if you want to select multiple items without reopening
      // this.showDropdown = false; 
    },
    removeItem(id) {
      const updated = this.selectedIds.filter(itemId => itemId !== id);
      this.$emit('update:modelValue', updated);
    },
    handleOutsideClick(e) {
      if (!this.$el.contains(e.target)) {
        this.showDropdown = false;
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick);
  }
};
</script>

<style scoped>
.btn-close-sm {
  width: 0.8rem;
  height: 0.8rem;
}
/* Ensure input doesn't push badges down when empty */
.form-control input {
  height: 0; 
  padding: 0;
  margin: 0;
  flex-basis: 100px; /* minimum width before wrapping text input */
}
.form-control:focus-within { /* Better styling for focus */
  border-color: #86b7fe; /* Example focus color, adjust as needed */
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25); /* Example focus shadow */
}
</style>