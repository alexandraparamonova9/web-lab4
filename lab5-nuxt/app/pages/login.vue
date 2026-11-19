<script setup>
const auth = useAuth()

definePageMeta({
  middleware: 'auth'
})

const username = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  error.value = ''

  try {
    await auth.login(username.value, password.value)
    await navigateTo('/students')
  } catch (err) {
    error.value = err.data?.message || err.statusMessage || 'Ошибка входа'
  }
}
</script>

<template>
  <main class="auth-page">
    <h1>Вход в систему</h1>

    <form @submit.prevent="handleLogin">
      <label for="username">Логин</label>
      <input
          id="username"
          v-model="username"
          required
      >

      <label for="password">Пароль</label>
      <input
          id="password"
          v-model="password"
          type="password"
          required
      >

      <p v-if="error" role="alert">{{ error }}</p>

      <button type="submit" :disabled="auth.loading.value">
        {{ auth.loading.value ? 'Загрузка...' : 'Войти' }}
      </button>
    </form>

    <NuxtLink to="/register">Зарегистрироваться</NuxtLink>
  </main>
</template>
