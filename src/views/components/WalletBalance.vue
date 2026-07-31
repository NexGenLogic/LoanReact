<template>
  <!-- Table Container -->
  <div class="rounded p-3 bg-white">
    <div v-if="balance && balance.length">
      <div class="d-flex fw-bold border-bottom pb-2 mb-3 text-secondary">
        <div class="flex-grow-1">Vendor</div>
        <div class="me-3">Balance</div>
        <div style="width: 200px;">Recharge</div>
      </div>

      <div
        v-for="(bal, index) in balance"
        :key="bal.vendor_id"
        :class="[
          'd-flex align-items-center py-2',
          index !== balance.length - 1 ? 'border-bottom' : ''
        ]"
      >
        <div class="flex-grow-1">{{ bal.vendor_name }}</div>
        <div class="me-3">SAR {{ bal.balance ?? 0 }}</div>
        <div style="width: 200px;">
          <input type="number" class="form-control" placeholder="Enter amount"  v-model.number="rechargeAmounts[bal.vendor_id]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WalletBalance',
  props: {
    balance: {
      type: Array,
      default: () => [],
    },
  },
   data() {
    return {
      rechargeAmounts: {},
    };
  },
  methods: {
    getRechargeValues() {
      return this.rechargeAmounts;
    }
  }
};
</script>
