<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/authStore.js'
import AppHeader from '../components/common/AppHeader.vue'
import AppLoader from '../components/common/AppLoader.vue'
import ErrorMessage from '../components/common/ErrorMessage.vue'
import StudentFilters from '../components/students/StudentFilters.vue'
import StudentTable from '../components/students/StudentTable.vue'
import StudentPagination from '../components/students/StudentPagination.vue'
import { createStudentSearch } from '../rxjs/studentSearch.js'
import { showError, showNotification } from '../rxjs/notifications.js'
import { deleteStudent } from '../services/studentService.js'
const auth = useAuthStore()
const search = createStudentSearch()
const students = ref([]), loading = ref(true), error = ref(''), deleting = ref(false)
const page = ref(0), size = ref(10), totalPages = ref(0), totalElements = ref(0)
const sortBy = ref('id'), direction = ref('asc')
const sortFields = [['id', 'ID'], ['fullName', 'ФИО'], ['groupName', 'Группа'], ['isuId', 'ИСУ ID'], ['dormNumber', 'Общежитие'], ['room', 'Комната'], ['moveInDate', 'Дата заселения'], ['isForeigner', 'Иностранный студент'], ['notes', 'Заметки']]
let filters = {}, subscription
function load(immediate = true) {
  search.search({ ...filters, page: page.value, size: size.value, sortBy: sortBy.value, direction: direction.value }, immediate)
}
function filterChanged(value, immediate) { filters = value; page.value = 0; load(immediate) }
function changePage(value) { page.value = value; load() }
function changeSize(value) { size.value = value; page.value = 0; load() }
function sortChanged() { page.value = 0; load() }
async function remove(student) {
  if (!auth.isAdmin || deleting.value || !window.confirm(`Удалить студента «${student.fullName}»?`)) return
  deleting.value = true
  try {
    await deleteStudent(student.id)
    showNotification('Студент удалён')
    load()
  } catch (err) { error.value = showError(err) }
  finally { deleting.value = false }
}
onMounted(() => {
  subscription = search.results$.subscribe(result => {
    loading.value = result.loading
    error.value = ''
    if (result.error) { students.value = []; totalPages.value = 0; totalElements.value = 0; error.value = showError(result.error) }
    if (result.data) {
      totalPages.value = result.data.totalPages
      totalElements.value = result.data.totalElements
      if (page.value > 0 && page.value >= totalPages.value) { page.value = Math.max(0, totalPages.value - 1); load(); return }
      students.value = result.data.content
    }
  })
  load()
})
onUnmounted(() => { subscription?.unsubscribe(); search.destroy() })
</script>
<template>
  <AppHeader />
  <main class="main"><div class="container"><section class="students">
    <div class="students-header"><h2>Список студентов</h2><RouterLink v-if="auth.isAdmin" to="/students/new" class="button button-add">Добавить студента</RouterLink></div>
    <StudentFilters @change="filterChanged" />
    <div class="sort-controls">
      <label class="form-group">Сортировать по<select v-model="sortBy" @change="sortChanged"><option v-for="[key, label] in sortFields" :key="key" :value="key">{{ label }}</option></select></label>
      <label class="form-group">Порядок<select v-model="direction" @change="sortChanged"><option value="asc">По возрастанию</option><option value="desc">По убыванию</option></select></label>
    </div>
    <ErrorMessage :message="error" />
    <button v-if="error" class="button button-secondary" @click="load()">Повторить</button>
    <AppLoader v-if="loading" />
    <StudentTable v-else-if="!error" :students="students" :can-edit="auth.isAdmin" :deleting="deleting" @delete="remove" />
    <StudentPagination :page="page" :size="size" :total-pages="totalPages" :total-elements="totalElements" :loading="loading || deleting" @page="changePage" @size="changeSize" />
  </section></div></main>
<footer class="footer"><p>Система управления студентами</p></footer>
</template>
