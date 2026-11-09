
<script setup>
defineProps({
  mode: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit'])

function handleSubmit(event) {
  const form = event.target

  const data = {
    username: form.username.value,
    password: form.password.value
  }

  if (form.elements.namedItem('email')) {
    data.email = form.elements.namedItem('email').value
  }

  emit('submit', data)
}
</script>

<template>
  <form class="auth-form" @submit.prevent="handleSubmit">

    <div class="form-group">
      <label for="username">Логин</label>
      <input
          id="username"
          name="username"
          placeholder="Введите логин"
          minlength="3"
          maxlength="50"
          required
      />
    </div>

    <div v-if="mode === 'register'" class="form-group">
      <label for="email">Email</label>
      <input
          id="email"
          name="email"
          type="email"
          placeholder="Введите email"
          required
      />
    </div>

    <div class="form-group">
      <label for="password">Пароль</label>
      <input
          id="password"
          name="password"
          type="password"
          placeholder="Введите пароль"
          :minlength="mode === 'register' ? 8 : undefined"
          required
      />
    </div>

    <button class="auth-button" type="submit" :disabled="loading">
      {{ loading ? 'Подождите...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться' }}
    </button>

  </form>
</template>
