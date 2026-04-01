# folio

> Every project is a leaf. A personal portfolio built with Vue.js & Node.js.

개발자 개인 브랜딩용 포트폴리오 사이트입니다. 앱·웹·기타 프로젝트를 소개하고, 관리자 CMS로 직접 콘텐츠를 관리합니다.

---

## 스택

**Frontend**
- Vue.js 3 (Composition API)
- Vue Router 5
- Pinia
- Axios
- Tailwind CSS v4

**Backend**
- Node.js + Express 5
- Prisma ORM v7 (PrismaPg adapter)
- PostgreSQL
- JWT 인증 (bcrypt + jsonwebtoken)
- Multer + AWS S3 (이미지 업로드)

**배포**
- Frontend: Vercel
- Backend + DB: Railway
- 이미지: AWS S3

---

## 폴더 구조

```
folio/
├── frontend/                   # Vue.js 프로젝트
│   ├── src/
│   │   ├── api/                # Axios 인스턴스 + API 함수
│   │   ├── assets/             # style.css (Tailwind)
│   │   ├── components/
│   │   │   ├── common/
│   │   │   └── admin/
│   │   ├── pages/
│   │   │   ├── Home.vue
│   │   │   ├── Projects.vue
│   │   │   ├── ProjectDetail.vue
│   │   │   ├── About.vue
│   │   │   └── admin/
│   │   │       ├── Login.vue
│   │   │       ├── ProjectList.vue
│   │   │       └── ProjectForm.vue
│   │   ├── router/
│   │   └── stores/             # Pinia (auth, projects)
│   └── package.json
│
└── backend/                    # Node.js 프로젝트
    ├── generated/              # Prisma Client (자동 생성)
    ├── src/
    │   ├── lib/
    │   │   └── prisma.js       # Prisma Client 싱글톤
    │   ├── middleware/
    │   │   └── authMiddleware.js
    │   ├── prisma/
    │   │   ├── schema.prisma
    │   │   ├── migrations/
    │   │   └── seed.js
    │   ├── routes/
    │   │   ├── auth.js
    │   │   ├── projects.js
    │   │   └── upload.js
    │   └── index.js
    ├── prisma.config.ts
    └── package.json
```

---

## 시작하기

### 요구사항

- Node.js 18+
- PostgreSQL
- AWS 계정 (S3 버킷)

### 1. 저장소 클론

```bash
git clone https://github.com/robincooding/folio.git
cd folio
```

### 2. 환경변수 설정

`backend/.env`:

```env
PORT=3000
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/folio
JWT_SECRET=your-secret-key
ADMIN_EMAIL=admin@folio.dev
ADMIN_PASSWORD=your-password
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-northeast-2
S3_BUCKET_NAME=your-bucket-name
```

`frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. 패키지 설치

```bash
# 백엔드
cd backend && npm install

# 프론트엔드
cd ../frontend && npm install
```

### 4. DB 마이그레이션 + 관리자 계정 생성

```bash
cd backend
npx prisma migrate dev
npx prisma generate
node src/prisma/seed.js
```

### 5. 개발 서버 실행

터미널 2개를 열어서:

```bash
# 터미널 1 — 백엔드 (localhost:3000)
cd backend && npm run dev

# 터미널 2 — 프론트엔드 (localhost:5173)
cd frontend && npm run dev
```

---

## 페이지 구성

| 경로 | 설명 |
|------|------|
| `/` | 홈 — Hero, 기술 스택, 최근 프로젝트 |
| `/projects` | 프로젝트 목록 — 카테고리 필터 |
| `/projects/:id` | 프로젝트 상세 — 이미지 갤러리, 링크 |
| `/about` | 소개 — 경력, 기술, 연락처 |
| `/admin/login` | 관리자 로그인 |
| `/admin/projects` | 프로젝트 관리 (CRUD) |

---

## API 엔드포인트

### Public

```
GET  /api/projects          # 목록 조회 (?category=app|web|other)
GET  /api/projects/:id      # 상세 조회
GET  /api/health            # 서버 상태 확인
```

### Admin (JWT 인증 필요)

```
POST   /api/auth/login        # 로그인 → JWT 발급
POST   /api/projects          # 프로젝트 등록
PUT    /api/projects/:id      # 프로젝트 수정
DELETE /api/projects/:id      # 프로젝트 삭제
POST   /api/upload            # 이미지 업로드 → S3 URL 반환
```

---

## DB 스키마

```prisma
model Project {
  id           String         @id @default(uuid())
  title        String
  description  String
  techStack    String[]
  category     Category       // app | web | other
  thumbnailUrl String
  demoUrl      String?
  githubUrl    String?
  createdAt    DateTime       @default(now())
  images       ProjectImage[]
}

model ProjectImage {
  id        String  @id @default(uuid())
  projectId String
  imageUrl  String
  order     Int
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
}

model Admin {
  id           String @id @default(uuid())
  email        String @unique
  passwordHash String
}
```

---

## 배포

### Vercel (Frontend)

1. Vercel에서 GitHub 레포 연결
2. Root Directory: `frontend`
3. Framework Preset: Vite (자동 감지)
4. 환경변수: `VITE_API_BASE_URL=https://<railway-도메인>/api`

### Railway (Backend + DB)

1. Railway에서 GitHub 레포 연결
2. Root Directory: `backend`
3. PostgreSQL 서비스 추가 후 `DATABASE_URL` 참조 연결
4. 환경변수 설정 (위 `.env` 항목 참고)
5. Build Command: `npm install && npx prisma generate`
6. Start Command: `npx prisma migrate deploy && npm start`
7. DB 시드 (로컬에서 `DATABASE_PUBLIC_URL` 사용):
   ```bash
   DATABASE_URL=<PUBLIC_URL> node src/prisma/seed.js
   ```

---

## 라이선스

MIT
