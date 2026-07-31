<template>
    <div class="outer-div">
  <div class="dropdown-container">
    <div class="input-wrapper" @click="toggleDropdown">
      <input
        type="text"
        v-model="search"
        class="dropdown-input"
        :placeholder="placeholder"
        @focus="showDropdown = true"
        :disabled="disabled"
      />
      <span class="dropdown-arrow">&#9662;</span>
    </div>

<ul v-show="showDropdown" class="dropdown-list">
  <li
    v-for="option in filteredOptions"
    :key="option.id"
    class="dropdown-item"
    @click="selectOption(option)"
  >
    {{ option.name }}
  </li>
  <li v-if="options.length === 0" class="dropdown-item no-match">
    No users available
  </li>
  <li v-else-if="filteredOptions.length === 0" class="dropdown-item no-match">
    No matching results
  </li>
</ul>
  </div>
  </div>
</template>

<script>
export default {
  name: 'SearchableSelect',
  props: {
    options: {
      type: Array,
      required: true,
      // [{ label: '1 - Guido Caffa', value: 1 }, { label: '2 - John Doe', value: 2 }]
    },
    modelValue: {
      type: [String, Number, Object],
      default: null,
    },
    placeholder: {
      type: String,
      default: 'Select...',
    },
  disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      search: '',
      showDropdown: false,
    };
  },
computed: {
  filteredOptions() {
    if (!Array.isArray(this.options) || this.options.length === 0) {
      return [];
    }
    return this.options.filter((opt) =>
      opt.name?.toLowerCase().includes(this.search.toLowerCase())
    );
  },
},
  watch: {
    modelValue: {
      immediate: true,
      handler(newVal) {
        const found = this.options.find((opt) => opt.id === newVal);
        if (found) {
          this.search = found.name;
        }
      },
    },
  },
  methods: {
    toggleDropdown() {
    if (this.disabled) return;          // <--- add this
    this.showDropdown = !this.showDropdown;
  },
    hideDropdown() {
      this.showDropdown = false;
    },
    selectOption(option) {
      if (this.disabled) return;  
      this.search = option.name;
      this.$emit('update:modelValue', option.id);
      this.showDropdown = false;
    },
  },

};
</script>

<style scoped>
.outer-div {
  width: 100%;
}
.dropdown-container {
  position: relative;
  /* width: 250px; */
  font-family: sans-serif;
}
.input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}
.dropdown-input {
  flex: 1;
  border: none;
  outline: none;
}
.dropdown-arrow {
  margin-left: 20px;
  font-size: 20px;
}
.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-top: none;
  background-color: white;
  z-index: 1000;
  padding: 0;
  margin: 0;
  list-style: none;
}
.dropdown-item {
  padding: 8px 10px;
  cursor: pointer;
  }
.dropdown-item:hover {
  background-color: #f0f0f0;
}
.no-match {
  color: #999;
  font-style: italic;
}
</style>
