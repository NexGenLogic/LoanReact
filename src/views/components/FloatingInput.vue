<template>
    <div class="floating-label mt-2">
      <input
        :type="type"
        :id="id"
        :name="name"
        :required="required"
        :placeholder="' '"
        class="form-input"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <label :for="id">{{ label }}</label>
    </div>
  </template>
  
  <script>
  export default {
    name: "FloatingInput",
    props: {
      modelValue: {
        type: String,
        default: ""
      },
      label: String,
      id: String,
      name: String,
      type: {
        type: String,
        default: "text"
      },
      required: {
        type: Boolean,
        default: false
      }
    },
    emits: ['update:modelValue']
  };
  </script>
  
  <style scoped>
  .floating-label {
    position: relative;
    margin-bottom: 20px;
  }
  
  .floating-label input {
    border: 1px solid #4A90E2;
    border-radius: 4px;
    padding: 7px 12px;
    font-size: 16px;
    width: 100%;
    outline: none;
  }
  
  .floating-label label {
    position: absolute;
    top: 10px;
    left: 12px;
    color: #999;
    font-size: 16px;
    transition: 0.2s ease all;
    pointer-events: none;
    background: white;
    padding: 0 4px;
  }
  
  .floating-label input:focus + label,
  .floating-label input:not(:placeholder-shown) + label {
    top: -10px;
    left: 10px;
    font-size: 12px;
    color: #4A90E2;
  }
  </style>
  