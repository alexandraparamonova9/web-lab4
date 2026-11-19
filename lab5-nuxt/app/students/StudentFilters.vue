<script setup>
const props = defineProps({
  filters: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:filters'])

const form = reactive({
  fullName: '',
  groupName: '',
  dormNumber: '',
  sortBy: 'id',
  direction: 'asc'
})

watch(
    () => props.filters,
    (filters) => {
      form.fullName = filters.fullName ?? ''
      form.groupName = filters.groupName ?? ''
      form.dormNumber = filters.dormNumber ?? ''
      form.sortBy = filters.sortBy ?? 'id'
      form.direction = filters.direction ?? 'asc'
    },
    { immediate: true, deep: true }
)

function updateFilters() {
  emit('update:filters', { ...form })
}
</script>

<template>
  <div>
    <input
        v-model="form.fullName"
        placeholder="Поиск по ФИО"
        @input="updateFilters"
    >

    <input
        v-model="form.groupName"
        placeholder="Группа"
        @input="updateFilters"
    >

    <input
        v-model="form.dormNumber"
        type="number"
        placeholder="Номер общежития"
        @input="updateFilters"
    >

    <select v-model="form.sortBy" @change="updateFilters">
      <option value="id">По ID</option>
      <option value="fullName">По ФИО</option>
      <option value="groupName">По группе</option>
    </select>

    <select v-model="form.direction" @change="updateFilters">
      <option value="asc">По возрастанию</option>
      <option value="desc">По убыванию</option>
    </select>
  </div>
</template>