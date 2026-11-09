
<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore.js'

const router = useRouter()
const auth = useAuthStore()

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <main class="main">
    <div class="container">
      <section class="profile-card">

        <div class="profile-heading">
          <div class="profile-avatar">👤</div>

          <div>
            <h1>Личный кабинет</h1>
            <p>Информация о вашей учётной записи</p>
          </div>
        </div>

        <div class="profile-info">
          <div class="profile-row">
            <span class="profile-label">Логин</span>
            <span>{{ auth.user?.username }}</span>
          </div>

          <div class="profile-row">
            <span class="profile-label">Роль</span>
            <span>{{ auth.user?.role }}</span>
          </div>

          <div class="profile-row">
            <span class="profile-label">Статус</span>
            <span>
              {{ auth.isAuthenticated ? 'Авторизован' : 'Не авторизован' }}
            </span>
          </div>
        </div>

        <button
            class="profile-logout"
            type="button"
            @click="handleLogout"
        >
          Выйти из аккаунта
        </button>

      </section>
    </div>
  </main>
</template>