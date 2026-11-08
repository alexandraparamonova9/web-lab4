<script setup>
import { computed, ref, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore.js'
import AppHeader from '../components/common/AppHeader.vue'
import AppLoader from '../components/common/AppLoader.vue'
import ErrorMessage from '../components/common/ErrorMessage.vue'
import StudentForm from '../components/students/StudentForm.vue'
import { getStudentById, addStudent, updateStudent } from '../services/studentService.js'
import { showError, showNotification } from '../rxjs/notifications.js'
const route = useRoute(), router = useRouter(), auth = useAuthStore()
const editing = computed(() => route.params.id !== undefined)
const student = ref(null), loading = ref(false), saving = ref(false), error = ref(''), serverErrors = ref({})
let controller
async function load(id) {
  controller?.abort()
  const request = new AbortController()
  controller = request
  student.value = null; error.value = ''; serverErrors.value = {}; loading.value = false
  if (!editing.value) return
  loading.value = true
  try {
    if (!/^[1-9]\d*$/.test(String(id))) throw new Error('Некорректный ID студента.')
    const data = await getStudentById(id, request.signal)
    if (!request.signal.aborted) student.value = data
  } catch (err) { if (!request.signal.aborted) error.value = showError(err) }
  finally { if (!request.signal.aborted) loading.value = false }
}
async function save(data) {
  if (saving.value || !auth.isAdmin) return
  saving.value = true; error.value = ''; serverErrors.value = {}
  try {
    if (editing.value) await updateStudent(route.params.id, data)
    else await addStudent(data)
    showNotification('Студент сохранён')
    await router.push('/students')
  } catch (err) { error.value = showError(err); serverErrors.value = err.details || {} }
  finally { saving.value = false }
}
watch(() => route.params.id, load, { immediate: true })
onUnmounted(() => controller?.abort())
</script>
<template>
  <AppHeader />
  <main class="main"><div class="container"><section class="student-form-section">
    <h2>{{ editing ? 'Редактирование студента' : 'Добавление студента' }}</h2>
    <ErrorMessage v-if="!auth.isAdmin" message="Изменять студентов может только администратор." />
    <template v-else><AppLoader v-if="loading" /><ErrorMessage :message="error" />
      <StudentForm v-if="!loading && (!editing || student)" :key="route.fullPath" :student="student" :editing="editing" :saving="saving" :server-errors="serverErrors" @save="save" />
    </template>
  </section></div></main>
<footer class="footer"><p>Система управления студентами</p></footer>
</template>
