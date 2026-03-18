import {Router} from "express";
import prisma from "../lib/prisma.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = Router()

// GET /api/projects - 목록 조회 (카테고리 필터)
router.get('/', async (req, res) => {
    const {category} = req.query
    try {
        const projects = await prisma.project.findMany({
            where: category ? {category} : undefined,
            orderBy: {createdAt: 'desc'},
            include: {images: {orderBy: {order: 'asc'}}}
        })
        res.json(projects)
    } catch (e) {
        res.status(500).json({message: '서버 오류'})
    }
})

// GET /api/projects/:id - 상세 조회
router.get('/:id', async (req, res) => {
    try {
        const project = await prisma.project.findUnique({
            where: {id: req.params.id},
            include: {images: {orderBy: {order: 'asc'}}}
        })
        if(!project) return res.status(404).json({message: '프로젝트를 찾을 수 없습니다.'})
        res.json(project)
    } catch (e) {
        res.status(500).json({message: '서버 오류'})
    }
})

// POST /api/projects - 등록 (인증 필요)
router.post('/', authMiddleware, async (req, res) => {
    const {title, description, techStack, category, thumbnailUrl, demoUrl, githubUrl, images} = req.body
    try {
        const project = await prisma.project.create({
            data: {
                title, description, techStack, category,
                thumbnailUrl, demoUrl, githubUrl,
                images: {
                    create: images?.map((url, i) => ({imageUrl: url, order: i})) ?? []
                }
            },
            include: {images: true}
        })
        res.status(201).json(project)
    } catch (e) {
        res.status(500).json({message: '서버 오류'})
    }
})

// PUT /api/projects/:id - 수정 (인증 필요)
router.put('/:id', authMiddleware, async (req, res) => {
    const { title, description, techStack, category, thumbnailUrl, demoUrl, githubUrl } = req.body
    try {
        const project = await prisma.project.update({
            where: { id: req.params.id },
            data: { title, description, techStack, category, thumbnailUrl, demoUrl, githubUrl }
        })
        res.json(project)
    } catch (e) {
        res.status(500).json({message: '서버 오류'})
    }
})

// DELETE /api/projects/:id - 삭제 (인증 필요)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await prisma.project.delete({where: {id: req.params.id}})
        res.status(204).end()
    } catch (e) {
        res.status(500).json({message: '서버 오류'})
    }
})

export default router