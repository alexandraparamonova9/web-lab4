<script setup>
const props = defineProps({
  student: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit'])

const form = reactive({
  fullName: '',
  groupName: '',
  isuId: null,
  dormNumber: null,
  room: null,
  moveInDate: '',
  isForeigner: false,
  notes: ''
})

watch(
    () => props.student,
    (student) => {
      form.fullName = student?.fullName ?? ''
      form.groupName = student?.groupName ?? ''
      form.isuId = student?.isuId ?? null
      form.dormNumber = student?.dormNumber ?? null
      form.room = student?.room ?? null
      form.moveInDate = student?.moveInDate ?? ''
      form.isForeigner = student?.isForeigner ?? false
      form.notes = student?.notes ?? ''
    },
    { immediate: true }
)

function submitForm() {
  emit('submit', { ...form })
}
</script>

<template>
  <form @submit.prevent="submitForm">
    <div>
      <label for="fullName">ФИО</label>
      <input
          id="fullName"
          v-model.trim="form.fullName"
          type="text"
          required
          pattern="[^0-9]*"
          title="ФИО не должно содержать цифры"
      >
    </div>

    <div>
      <label for="groupName">Группа</label>
      <input
          id="groupName"
          v-model.trim="form.groupName"
          type="text"
          required
          pattern="[A-Za-zА-Яа-яЁё][0-9]{4}"
          placeholder="P3123"
          title="Одна буква и четыре цифры"
      >
    </div>

    <div>
      <label for="isuId">ИСУ ID</label>
      <input
          id="isuId"
          v-model.number="form.isuId"
          type="number"
          min="1"
          required
      >
    </div>

    <div>
      <label for="dormNumber">Номер общежития</label>
      <input
          id="dormNumber"
          v-model.number="form.dormNumber"
          type="number"
          min="1"
          required
      >
    </div>

    <div>
      <label for="room">Комната</label>
      <input
          id="room"
          v-model.number="form.room"
          type="number"
          min="1"
          required
      >
    </div>

    <div>
      <label for="moveInDate">Дата заселения</label>
      <input
          id="moveInDate"
          v-model="form.moveInDate"
          type="date"
          required
      >
    </div>

    <div>
      <label for="isForeigner">Иностранный студент</label>
      <select id="isForeigner" v-model="form.isForeigner">
        <option :value="false">Нет</option>
        <option :value="true">Да</option>
      </select>
    </div>

    <div>
      <label for="notes">Заметки</label>
      <textarea
          id="notes"
          v-model="form.notes"
          maxlength="2000"
          rows="4"
      />
    </div>

    <button type="submit" :disabled="loading">
      {{ loading ? 'Сохранение...' : 'Сохранить' }}
    </button>
  </form>
</template>