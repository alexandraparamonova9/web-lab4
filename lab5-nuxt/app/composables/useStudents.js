export function useStudents() {
    const auth = useAuth()

    async function request(path, options = {}) {
        async function send(token) {
            return await $fetch(`/api/backend/students${path}`, {
                ...options,
                headers: {
                    ...options.headers,
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                }
            })
        }

        try {
            return await send(auth.accessToken.value)
        } catch (error) {
            if (
                error.statusCode !== 401 ||
                !auth.refreshToken.value
            ) {
                throw error
            }

            try {
                const newToken = await auth.refresh()
                return await send(newToken)
            } catch (refreshError) {
                await auth.logout()
                throw refreshError
            }
        }
    }

    function getStudents(filters = {}) {
        return request('/search', {
            query: filters
        })
    }

    function getStudentById(id) {
        return request(`/${id}`)
    }

    async function addStudent(student) {
        const result = await request('', {
            method: 'POST',
            body: student
        })

        await refreshNuxtData('students')
        return result
    }

    async function updateStudent(id, student) {
        const result = await request(`/${id}`, {
            method: 'PUT',
            body: student
        })

        await refreshNuxtData('students')
        await refreshNuxtData(`student-${id}`)

        return result
    }

    async function deleteStudent(id) {
        const result = await request(`/${id}`, {
            method: 'DELETE'
        })

        await refreshNuxtData('students')
        return result
    }

    return {
        getStudents,
        getStudentById,
        addStudent,
        updateStudent,
        deleteStudent
    }
}