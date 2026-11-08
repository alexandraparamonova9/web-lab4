<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore.js'
import AppHeader from '../components/common/AppHeader.vue'
import AppLoader from '../components/common/AppLoader.vue'
import ErrorMessage from '../components/common/ErrorMessage.vue'
import { getStudentById } from '../services/studentService.js'
import { showError } from '../rxjs/notifications.js'
const route = useRoute(), auth = useAuthStore()
const student = ref(null), loading = ref(false), error = ref('')
const fields = [['fullName', 'ФИО'], ['groupName', 'Группа'], ['isuId', 'ИСУ ID'], ['dormNumber', 'Общежитие'], ['room', 'Комната'], ['moveInDate', 'Срок заселения'], ['isForeigner', 'Иностранный студент'], ['notes', 'Заметки']]
let controller
function display(key) {
  const value = student.value[key]
  if (key === 'isForeigner') return value ? 'Да' : 'Нет'
  if (key === 'moveInDate' && value) return value.split('-').reverse().join('.')
  return value || '—'
}
async function load(id) {
  controller?.abort()
  const request = new AbortController()
  controller = request
  student.value = null; error.value = ''; loading.value = true
  try {
    if (!/^[1-9]\d*$/.test(String(id))) throw new Error('Некорректный ID студента.')
    const data = await getStudentById(id, request.signal)
    if (!request.signal.aborted) student.value = data
  } catch (err) { if (!request.signal.aborted) error.value = showError(err) }
  finally { if (!request.signal.aborted) loading.value = false }
}
watch(() => route.params.id, load, { immediate: true })
onUnmounted(() => controller?.abort())
</script>
<template>
  <AppHeader />
  <main class="main"><div class="container"><section class="student-card">
    <h2>Досье студента</h2><AppLoader v-if="loading" /><ErrorMessage :message="error" />
    <div v-if="student" class="student-details"><div v-for="[key, label] in fields" :key="key" class="detail-row"><span class="detail-label">{{ label }}:</span><span class="detail-value">{{ display(key) }}</span></div></div>
    <div class="student-actions form-actions"><RouterLink to="/students" class="button button-secondary">← Назад к списку</RouterLink><RouterLink v-if="student && auth.isAdmin" :to="`/students/${student.id}/edit`" class="button button-secondary">Изменить</RouterLink></div>
  </section></div></main>
<footer class="footer"><p>Система управления студентами</p></footer>
</template>
