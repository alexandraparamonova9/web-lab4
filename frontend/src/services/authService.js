
import { apiRequest } from './api.js'

function postOptions(data) {
    return {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }
}

export function login(username, password) {
    return apiRequest(
        '/api/auth/login',
        postOptions({ username, password })
    )
}

export function register(data) {
    return apiRequest(
        '/api/auth/register',
        postOptions(data)
    )
}

export async function refreshToken(refreshTokenValue) {
    const response = await fetch(
        '/api/auth/refresh',
        postOptions({ refreshToken: refreshTokenValue })
    )

    if (!response.ok) {
        throw new Error('Не удалось обновить токен')
    }

    return response.json()
}
