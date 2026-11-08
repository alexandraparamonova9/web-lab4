import { Subject, concat, of, timer, switchMap, map } from 'rxjs'
const messages = new Subject()
// Новое сообщение заменяет предыдущее и исчезает через пять секунд.
export const notifications$ = messages.pipe(
  switchMap(message => concat(of(message), timer(5000).pipe(map(() => null))))
)
export function showNotification(message, type = 'success') {
  messages.next({ message, type })
}
export function showError(error) {
  const statuses = {
    400: 'Проверьте заполнение полей.', 401: 'Войдите в систему заново.',
    403: 'Недостаточно прав для этого действия.', 404: 'Студент не найден.',
    409: 'Студент с таким ИСУ ID уже существует.', 500: 'Ошибка сервера. Попробуйте позже.'
  }
  const status = error?.status || error?.message?.match(/^Ошибка сервера: (\d+)$/)?.[1]
  const message = statuses[status] || (error instanceof TypeError
    ? 'Не удалось связаться с сервером. Проверьте соединение.'
    : error?.message || 'Не удалось выполнить запрос. Попробуйте ещё раз.')
  showNotification(message, 'error')
  return message
}
