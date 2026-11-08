<script setup>
import AppHeader from '../components/common/AppHeader.vue'
</script>
<template>
  <AppHeader />
  <main class="main"><div class="container"><section class="student-card">
    <h2>404 — Страница не найдена</h2><p>Проверьте адрес или вернитесь к списку студентов.</p>
    <RouterLink to="/students" class="button button-secondary">К списку студентов</RouterLink>
  </section></div></main>
  <footer class="footer"><p>Система управления студентами</p></footer>
</template>
