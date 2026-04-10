import {Router} from "express";
import multer from "multer";
import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import {authMiddleware} from "../middleware/authMiddleware.js";
import * as path from "path";
import {randomUUID} from 'crypto'

const router = Router()
const upload = multer({storage: multer.memoryStorage()})

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
})

// POST /api/upload - 이미지 업로 -> S3 URL 반환 (인증 필요)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    if(!req.file) return res.status(400).json({message: '파일이 없습니다'})

    const ext = path.extname(req.file.originalname)
    const key = `projects/${randomUUID()}${ext}`

    try {
        await s3.send(new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        }))

        // S3 public URL 반환
        const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
        res.json({url})
    } catch (e) {
        console.error(e)
        res.status(500).json({message: '업로드 실패'})
    }
})

export default router