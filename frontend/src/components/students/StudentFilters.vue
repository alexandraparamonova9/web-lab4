<script setup>
import { reactive } from 'vue'
const emit = defineEmits(['change'])
const empty = { fullName: '', groupName: '', isuId: '', dormNumber: '', room: '', moveInDate: '', isForeigner: '', notes: '' }
const filters = reactive({ ...empty })
const fields = [
  ['fullName', 'ФИО', 'text', 'Часть имени'], ['groupName', 'Группа', 'text', 'M3301'],
  ['isuId', 'ИСУ ID', 'number', '123456'], ['dormNumber', 'Общежитие', 'number', '8'],
  ['room', 'Комната', 'number', '500'], ['moveInDate', 'Дата заселения', 'date', ''],
  ['notes', 'Заметки', 'text', 'Часть заметки']
]
function change(immediate = false) { emit('change', { ...filters }, immediate) }
function reset() { Object.assign(filters, empty); change(true) }
</script>
<template>
  <form class="filters" @submit.prevent="change(true)">
    <div v-for="[key, label, type, placeholder] in fields" :key="key" class="form-group">
      <label :for="`filter-${key}`">{{ label }}</label>
      <input :id="`filter-${key}`" v-model="filters[key]" :type="type" :placeholder="placeholder"
        :min="type === 'number' ? 1 : undefined" :max="type === 'number' ? 2147483647 : undefined"
        :step="type === 'number' ? 1 : undefined" @input="change()">
    </div>
    <div class="form-group">
      <label for="filter-foreigner">Иностранный студент</label>
      <select id="filter-foreigner" v-model="filters.isForeigner" @change="change(true)">
        <option value="">Все</option><option value="true">Да</option><option value="false">Нет</option>
      </select>
    </div>
    <div class="filter-actions">
      <button class="button button-save" type="submit">Найти</button>
      <button class="button button-secondary" type="button" @click="reset">Сбросить</button>
    </div>
  </form>
</template>
