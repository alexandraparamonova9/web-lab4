<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore.js'
import '../../assets/style.css'
import { logout as performLogout } from '../../services/logout.js'
const auth = useAuthStore()
const router = useRouter()
function logout() {
  performLogout(auth, router)
}
</script>
<template>
  <header class="header">
    <div class="container header-content">
      <h1>Система студентов</h1>
      <nav class="header-links" aria-label="Главное меню">
        <template v-if="auth.isAuthenticated">
          <RouterLink to="/profile" class="button button-secondary">Профиль</RouterLink>
          <button type="button" class="button button-secondary" @click="logout">Выйти</button>
        </template>
        <RouterLink v-else to="/login" class="button button-secondary">Войти</RouterLink>
      </nav>
    </div>
  </header>
</template>
