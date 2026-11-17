import { Subject, Observable, timer, switchMap, startWith, catchError, of } from 'rxjs'
import { getStudents } from '../services/studentService.js'
const SEARCH_DELAY_MS = 350

export function createStudentSearch() {
  const requests = new Subject()
  const results$ = requests.pipe(
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
    search(filters, immediate = false) { requests.next({ filters: { ...filters }, delay: immediate ? 0 : SEARCH_DELAY_MS }) },
    destroy() { requests.complete() }
  }
}
