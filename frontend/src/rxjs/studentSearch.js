import { Subject, Observable, timer, switchMap, startWith, catchError, of } from 'rxjs'
import { getStudents } from '../services/studentService.js'

export function createStudentSearch() {
  const requests = new Subject()
  const results$ = requests.pipe(
    // Сразу отменяем старый запрос, затем ждём окончания ввода (debounce).
    switchMap(({ filters, delay }) => timer(delay).pipe(
      switchMap(() => new Observable(subscriber => {
        const controller = new AbortController()
        getStudents(filters, controller.signal).then(data => {
          subscriber.next({ loading: false, data, error: null })
          subscriber.complete()
        }).catch(error => subscriber.error(error))
        return () => controller.abort()
      })),
      catchError(error => of({ loading: false, data: null, error })),
      startWith({ loading: true, data: null, error: null })
    ))
  )
  return {
    results$,
    search(filters, immediate = false) { requests.next({ filters: { ...filters }, delay: immediate ? 0 : 350 }) },
    destroy() { requests.complete() }
  }
}
