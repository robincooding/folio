// 로그인 요청을 받아서 JWT 발급
import {Router} from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from "../lib/prisma.js"

const router = Router()

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        // 1. 이메일로 관리자 조회
        const admin = await prisma.admin.findUnique({ where: { email } })
        if(!admin) return res.status(401).json({ message: '인증 실패' })

        // 2. 비밀번호 검증
        const isValid = await bcrypt.compare(password, admin.passwordHash)
        if(!isValid) return res.status(401).json({ message: '인증 실패' })

        // 3. JWT 발급 (7일 유효)
        const token = jwt.sign(
            { id: admin.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d'}
        )
        res.json({ token })
    } catch {
        res.status(500).json({ message: '서버 오류' })
    }
})

export default router