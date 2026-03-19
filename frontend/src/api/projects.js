import api from './axios'

export const projectsApi = {
    getAll: (params) => api.get('/projects', {params}),
    getOne: (id) => api.get(`/projects/${id}`),
    create: (data) => api.post('/projects', data),
    update: (id, data) => api.put(`/projects/${id}`, data),
    remove: (id) => api.delete(`/projects/${id}`)
}

export const uploadApi = {
    image: (formData) => api.post('/upload', formData, {
        headers: {'Content-Type': 'multipart/form-data'}
    })
}

export const authApi = {
    login: (email, password) => api.post('/auth/login', {email, password})
}