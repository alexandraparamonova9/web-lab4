<script setup>
import { notifications$ } from '../../rxjs/notifications.js'
import { useObservable } from '../../rxjs/useObservable.js'
const notification = useObservable(notifications$)
</script>

<template>
  <div
      v-if="notification"
      class="notification"
      :class="notification.type"
      role="status"
  >
    {{ notification.message }}
  </div>
</template>
