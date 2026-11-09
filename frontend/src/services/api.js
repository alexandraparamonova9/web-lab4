
import { useAuthStore } from '../stores/authStore.js'

let refreshPromise = null

export async function apiRequest(path, options = {}) {
    const auth = useAuthStore()
    const tokenBeforeRequest = auth.accessToken

    async function sendRequest() {
        const headers = {
            ...options.headers
        }

        if (auth.accessToken) {
            headers.Authorization = `Bearer ${auth.accessToken}`
        }

        return fetch(path, {
            ...options,
            headers
        })
    }

    let response = await sendRequest()

    if (
        response.status === 401 &&
        auth.refreshToken &&
        !path.startsWith('/api/auth/')
    ) {
        try {
            if (auth.accessToken === tokenBeforeRequest) {
                if (!refreshPromise) {
                    const promise = auth.refresh()
                    refreshPromise = promise

                    promise.finally(() => {
                        if (refreshPromise === promise) {
                            refreshPromise = null
                        }
                    }).catch(() => {})
                }

                await refreshPromise
            }

            response = await sendRequest()
        } catch (error) {
            auth.logout()

            const sessionError = new Error(
                'Сессия истекла. Войдите снова.'
            )
            sessionError.status = 401
            sessionError.details = null

            throw sessionError
        }
    }

    if (!response.ok) {
        const body = await response.json().catch(() => null)

        const error = new Error(
            body?.error?.message ||
            `Ошибка сервера: ${response.status}`
        )

        error.status = body?.error?.status ?? response.status
        error.details = body?.error?.details ?? null

        throw error
    }

    if (response.status === 204) {
        return null
    }

    return response.json()
}
