import { firstValueFrom } from 'rxjs'
import { defineStore } from 'pinia'
import { getUserFromToken } from '../services/jwtUtils.js'
import {
    refreshAccessToken,
    resetRefreshRequest
} from '../rxjs/authRefresh.js'
import {
    login as loginRequest,
    register as registerRequest
} from '../services/authService.js'

const ADMIN_ROLE = 'ADMIN'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: null,
        refreshToken: null,
        user: null,
        loading: false
    }),

    getters: {
        isAuthenticated: (state) => !!state.accessToken,
        isAdmin: (state) => state.user?.role === ADMIN_ROLE
    },

    actions: {
        setTokens(response) {
            this.accessToken = response.accessToken
            this.refreshToken = response.refreshToken
            this.user = getUserFromToken(response.accessToken)
        },

        async authenticate(request) {
            this.loading = true

            try {
                const response = await request()
                this.setTokens(response)
                return response
            } finally {
                this.loading = false
            }
        },

        async login(username, password) {
            return this.authenticate(
                () => loginRequest(username, password)
            )
        },

        async register(data) {
            return this.authenticate(
                () => registerRequest(data)
            )
        },

        async refresh() {
            if (!this.refreshToken) {
                throw new Error('Нет refresh-токена')
            }

            try {
                const response = await firstValueFrom(
                    refreshAccessToken(this)
                )

                this.setTokens(response)
                return response.accessToken
            } finally {
                resetRefreshRequest()
            }
        },

        logout() {
            this.accessToken = null
            this.refreshToken = null
            this.user = null
        }
    }
})