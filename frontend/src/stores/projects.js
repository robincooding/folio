import {defineStore} from 'pinia'
import {ref} from 'vue'
import {projectsApi} from '@/api/projects'

export const useProjectsStore = defineStore('projects', () => {
    const projects = ref([])
    const currentProject = ref(null)
    const loading = ref(false)

    async function fetchProjects(category = null) {
        loading.value = true
        try {
            const params = category ? {category} : {}
            const {data} = await projectsApi.getAll(params)
            projects.value = data
        } finally {
            loading.value = false
        }
    }

    async function fetchProject(id) {
        loading.value = true
        try {
            const {data} = await projectsApi.getOne(id)
            currentProject.value = data
        } finally {
            loading.value = false
        }
    }

    return {projects, currentProject, loading, fetchProjects, fetchProject}
})