export default defineNuxtConfig({
    compatibilityDate: '2026-11-17',

    devtools: {
        enabled: true
    },

    ssr: true,

    runtimeConfig: {
        backendUrl: 'http://localhost:8080'
    }
})