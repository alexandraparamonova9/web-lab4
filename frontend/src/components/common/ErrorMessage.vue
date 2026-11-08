<script setup>
defineProps({ message: { type: String, default: '' } })
</script>
<template><p v-if="message" class="message message-error" role="alert">{{ message }}</p></template>
