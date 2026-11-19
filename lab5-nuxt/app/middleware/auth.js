export default defineNuxtRouteMiddleware((to) => {
    const auth = useAuth()

    const publicPages = ['/login', '/register']
    const isPublicPage = publicPages.includes(to.path)

    if (!auth.isAuthenticated.value && !isPublicPage) {
        return navigateTo('/login')
    }

    if (auth.isAuthenticated.value && isPublicPage) {
        return navigateTo('/students')
    }

    const adminOnly =
        to.path === '/students/new' ||
        /^\/students\/[^/]+\/edit$/.test(to.path)

    if (adminOnly && !auth.isAdmin.value) {
        return navigateTo('/403')
    }
})