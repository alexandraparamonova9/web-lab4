<script setup>
defineProps({ message: { type: String, default: 'Загрузка...' } })
</script>
<template><p class="message app-loader" role="status" aria-live="polite">{{ message }}</p></template>
