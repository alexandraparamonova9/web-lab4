<script setup>
import { reactive, ref, watch } from 'vue'
const NAME_DIGITS_REGEX = /[0-9]/
const GROUP_REGEX = /^\p{L}[0-9]{4}$/u
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

const MAX_NUMBER = 10000
const MAX_JAVA_INT = 2147483647
const MAX_NOTES_LENGTH = 2000

const MIN_DATE = '0001-01-01'
const MAX_DATE = '2300-12-31'
const props = defineProps({ student: Object, editing: Boolean, saving: Boolean, serverErrors: { type: Object, default: () => ({}) } })
const emit = defineEmits(['save'])
const form = reactive({ fullName: '', groupName: '', isuId: '', dormNumber: '', room: '', moveInDate: '', isForeigner: false, notes: '' })
const errors = ref({})


watch(() => props.student, student => { if (student) Object.assign(form, student) }, { immediate: true })
const fields = [
  ['fullName', 'ФИО студента', 'text', 'Иванов Иван Иванович'],
  ['groupName', 'Группа', 'text', 'P3210'], ['isuId', 'ИСУ ID', 'number', '123456'],
  ['dormNumber', 'Номер общежития', 'number', '8'], ['room', 'Комната', 'number', '315'],
  ['moveInDate', 'Срок заселения', 'date', '']
]


function save() {
  if (props.saving) return
  const data = { ...form, fullName: form.fullName.trim(), groupName: form.groupName.trim(), notes: (form.notes || '').trim() }
  const invalid = {}
  if (!data.fullName || NAME_DIGITS_REGEX.test(data.fullName)) invalid.fullName = 'Введите ФИО без цифр.'
  if (!GROUP_REGEX.test(data.groupName)) invalid.groupName = 'Группа: одна буква и четыре цифры.'
  for (const key of ['isuId', 'dormNumber', 'room']) {
    data[key] = Number(data[key])
    if (!Number.isInteger(data[key]) || data[key] <= 0 || data[key] > MAX_NUMBER) invalid[key] = 'Введите целое число от 1 до 10000.'
  }
  if (!DATE_REGEX.test(data.moveInDate) || !Number.isFinite(Date.parse(data.moveInDate)) || data.moveInDate < MIN_DATE || data.moveInDate > MAX_DATE) invalid.moveInDate = 'Введите дату не позднее 31.12.2300.'
  if (data.notes.length > MAX_NOTES_LENGTH) invalid.notes = 'Заметки не длиннее 2000 символов.'
  errors.value = invalid
  if (!Object.keys(invalid).length) emit('save', data)
}
</script>



<template>
  <form class="student-form" novalidate @submit.prevent="save">

    <div v-for="[key, label, type, placeholder] in fields" :key="key" class="form-group">
      <label :for="key">{{ label }}</label>
      <input :id="key" v-model="form[key]" :type="type" :placeholder="placeholder" required
        :readonly="editing && key === 'isuId'" :disabled="saving"
             :min="type === 'number' ? 1 : type === 'date' ? MIN_DATE : undefined"
             :max="type === 'number' ? MAX_JAVA_INT : type === 'date' ? MAX_DATE : undefined"
        :step="type === 'number' ? 1 : undefined"
        :class="{ 'input-invalid': errors[key] || serverErrors[key] }"
        :aria-invalid="!!(errors[key] || serverErrors[key])" :aria-describedby="`${key}-error`">
      <span :id="`${key}-error`" class="field-error">{{ errors[key] || serverErrors[key] }}</span>
    </div>


    <div class="form-group checkbox-group"><input id="isForeigner" v-model="form.isForeigner" type="checkbox" :disabled="saving"><label for="isForeigner">Иностранный студент</label></div>
    <div class="form-group"><label for="notes">Заметки</label>
      <textarea id="notes" v-model="form.notes" rows="5" :maxlength="MAX_NOTES_LENGTH" :disabled="saving" placeholder="Дополнительная информация" aria-describedby="notes-error"></textarea>
      <span id="notes-error" class="field-error">{{ errors.notes || serverErrors.notes }}</span>
    </div>
    <div class="form-actions"><button type="submit" class="button button-save" :disabled="saving">{{ saving ? 'Сохранение...' : 'Сохранить' }}</button><RouterLink to="/students" class="button button-secondary">Отмена</RouterLink></div>
  </form>
</template>
