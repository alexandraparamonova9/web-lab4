export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)

    const path = getRouterParam(event, 'path') || ''
    const method = getMethod(event)

    const headers = {}

    const authorization = getHeader(event, 'authorization')

    if (authorization) {
        headers.Authorization = authorization
    }

    try {
        return await $fetch(`${config.backendUrl}/api/${path}`, {
            method,
            query: getQuery(event),
            headers,

            ...(method !== 'GET' && method !== 'HEAD'
                ? { body: await readBody(event) }
                : {})
        })
    } catch (error) {
        throw createError({
            statusCode: error.statusCode || error.status || 500,
            statusMessage: error.data?.message || 'Ошибка backend',
            data: error.data
        })
    }
})