export function useAuth() {
    const accessToken = useCookie('accessToken', {
        default: () => null,
        sameSite: 'lax',
        path: '/'
    })

    const refreshToken = useCookie('refreshToken', {
        default: () => null,
        sameSite: 'lax',
        path: '/'
    })

    const loading = useState('authLoading', () => false)

    const isAuthenticated = computed(() => !!accessToken.value)

    function getPayload() {
        if (!accessToken.value) return null

        try {
            const payload = accessToken.value.split('.')[1]
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
            const decoded = atob(base64)

            return JSON.parse(decoded)
        } catch {
            return null
        }
    }

    const user = computed(() => getPayload())

    const isAdmin = computed(() => {
        const role = user.value?.role
        return role === 'ADMIN' || role === 'ROLE_ADMIN'
    })

    async function login(username, password) {
        loading.value = true

        try {
            const response = await $fetch('/api/backend/auth/login', {
                method: 'POST',
                body: { username, password }
            })

            accessToken.value = response.accessToken
            refreshToken.value = response.refreshToken

            return response
        } finally {
            loading.value = false
        }
    }

    async function register(data) {
        loading.value = true

        try {
            return await $fetch('/api/backend/auth/register', {
                method: 'POST',
                body: data
            })
        } finally {
            loading.value = false
        }
    }

    async function refresh() {
        if (!refreshToken.value) {
            throw new Error('Нет refresh-токена')
        }

        const response = await $fetch('/api/backend/auth/refresh', {
            method: 'POST',
            body: {
                refreshToken: refreshToken.value
            }
        })

        accessToken.value = response.accessToken

        if (response.refreshToken) {
            refreshToken.value = response.refreshToken
        }

        return accessToken.value
    }

    function logout() {
        accessToken.value = null
        refreshToken.value = null

        return navigateTo('/login')
    }

    return {
        accessToken,
        refreshToken,
        loading,
        user,
        isAuthenticated,
        isAdmin,
        login,
        register,
        refresh,
        logout
    }
}