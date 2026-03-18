import "dotenv/config"
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

async function main() {
    const email = process.env.ADMIN_EMAIL || 'admin@folio.dev'
    const password = process.env.ADMIN_PASSWORD || 'folio1234'

    const passwordHash = await bcrypt.hash(password, 10)

    await prisma.admin.upsert({
        where: {email},
        update: {passwordHash},
        create: {email, passwordHash}
    })

    console.log(`✅ 관리자 계정 생성: ${email}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())