import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import prisma from "./lib/prisma.js";

const app = express()
const PORT = process.env.PORT || 3000

// MiddleWare
/// CORS
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173'
}))

/// Parse JSON
app.use(express.json())

// Routers
import authRoutes from "./routes/auth.js"
import projectRoutes from './routes/projects.js'
// import uploadRoutes from './routes/upload.js'

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
// app.use('/api/upload', uploadRoutes)

// Check Server Health
app.get('/api/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1` // DB연결 확인용 쿼리
        res.json({status: 'ok', db: 'connected'})
    } catch (e) {
        res.status(500).json({status: 'error', db: 'disconnected'})
    }
    // res.json({status: 'ok', message: 'folio server is running'})
})

// Run Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
})