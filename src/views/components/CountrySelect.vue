<template>
    <div class="country-select">
    
      <select
        :id="id"
        class="form-select"
        :value="modelValue"
        :name="name"
        :disabled="disabled"
        @change="$emit('update:modelValue', $event.target.value)"
      >
      <option value="" disabled selected>Select a country</option>
        <option
          v-for="country in countries"
          :key="country.code"
          :value="country.code"
        >
          {{ country.name }}
        </option>
      </select>
  
      <!-- Show selected flag (optional) -->
      <div v-if="selectedCountry" class="flag-preview mt-2">
        <img
          :src="getFlagUrl(selectedCountry.code)"
          alt="Flag"
          width="32"
          height="24"
        />
        <span class="ms-2">{{ selectedCountry.name }}</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CountrySelect',
    props: {
      modelValue: {
        type : String,
        default : ""
      },
      label: {
        type: String,
        default: 'Select Country'
      },
      id: {
        type: String,
        default: 'country'
      },
      name : {
        type : String,
        default: 'country'
      },
      disabled : {
        type : Boolean,
        default : false
      }
      
    },
    data() {
      return {
        countries: [
          { name: 'India', code: 'In' },
          { name: 'United Kingdom', code: 'UK' },
        ]
      };
    },
    computed: {
      selectedCountry() {
        return this.countries.find(c => c.code === this.modelValue);
      }
    },
    methods: {
      getFlagUrl(code) {
        return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
        // Alternative: https://countryflagsapi.com/png/${code}
      }
    }
  };
  </script>
  
  <style scoped>
  .country-select select {
    width: 100%;
    /* padding: 6px 10px; */
    font-size: 14px;
    /* border-radius: 4px; */
    border: 1px solid var(--input-pixi-border-color);
  }
  
  .flag-preview {
    display: flex;
    align-items: center;
  }
  </style>
  