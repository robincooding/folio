// 토큰이 유효한지 검증 - 인증 필요한 라우터에 이 미들웨어 붙이기
import jwt from 'jsonwebtoken'

export function authMiddleware(req, res, next) {
    const auth = req.headers.authorization

    // Authorization: Bearer <token> 형식인지 확인
    if (!auth || !auth.startsWith('Bearer')) {
        return res.status(401).json({message: '인증이 필요합니다'})
    }

    try {
        const token = auth.slice(7) // "Bearer" 이후 토큰만 추출
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.adminId = payload.id // 라우터에서 req.adminId로 접근 가능
        next()
    } catch (e) {
        res.status(401).json({message: '유효하지 않은 토큰입니다'})
    }
}