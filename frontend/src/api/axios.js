import axios from 'axios'

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 10000
})

// 요청 인터셉터 — 모든 요청에 JWT 자동 첨부
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// 응답 인터셉터 — 401이면 토큰 삭제 후 로그인 페이지로
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/admin/login'
        }
        return Promise.reject(error)
    }
)

export default instance