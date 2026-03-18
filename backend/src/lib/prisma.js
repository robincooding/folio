// new PrismaClient()를 매 라우터 파일마다 호출하면 DB 연결이 요청마다 새로 생성
// 연결 낭비이므로 하나의 인스턴스를 만들어 재사용한다.

import { PrismaClient } from '../../generated/prisma/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
})

const prisma = new PrismaClient({ adapter })

export default prisma