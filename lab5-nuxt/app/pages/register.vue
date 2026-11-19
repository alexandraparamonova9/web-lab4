<script setup>
const auth = useAuth()

definePageMeta({
  middleware: 'auth'
})

const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

async function handleRegister() {
  error.value = ''

  try {
    await auth.register({
      username: username.value,
      email: email.value,
      password: password.value
    })

    await navigateTo('/students')
  } catch (err) {
    error.value = err.data?.message || err.statusMessage || 'Ошибка регистрации'
  }
}
</script>

<template>
  <main class="auth-page">
    <h1>Регистрация</h1>

    <form @submit.prevent="handleRegister">
      <label for="username">Логин</label>
      <input
          id="username"
          v-model="username"
          minlength="3"
          maxlength="50"
          required
      >

      <label for="email">Email</label>
      <input
          id="email"
          v-model="email"
          type="email"
          required
      >

      <label for="password">Пароль</label>
      <input
          id="password"
          v-model="password"
          type="password"
          minlength="8"
          required
      >

      <p v-if="error" role="alert">{{ error }}</p>

      <button type="submit" :disabled="auth.loading.value">
        {{ auth.loading.value ? 'Загрузка...' : 'Зарегистрироваться' }}
      </button>
    </form>

    <NuxtLink to="/login">Уже есть аккаунт? Войти</NuxtLink>
  </main>
</template>
