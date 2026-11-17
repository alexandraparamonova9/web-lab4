export function logout(auth, router) {
    auth.logout()
    return router.push('/login')
}