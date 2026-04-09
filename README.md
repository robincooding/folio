# folio

> A personal portfolio that feels like flipping through a real folder.

개발자 포트폴리오 사이트입니다. 프로젝트를 물리적인 폴더/파일철 메타포로 탐색하며, 관리자 CMS로 콘텐츠를 관리합니다.

---

## 주요 기능

- **폴더 랜딩** - 화면 중앙의 폴더를 클릭하면 내부 파일 탐색 시작
- **파일 넘겨보기** - 위에서 내려다보는 시점으로 프로젝트 파일을 한 장씩 넘기며 열람
- **섹션 그룹** - 프로젝트를 섹션별로 묶어 좌측 탭으로 표시, 우측에 다음 파일 탭 미리보기
- **키보드 내비게이션** - 방향키로 파일 넘기기, ESC로 되돌아가기
- **다크/라이트 모드** - CSS 변수 기반 테마, localStorage 저장
- **관리자 CMS** - 프로젝트 등록/수정/삭제, 이미지 업로드(S3)
- **숨겨진 관리자 진입** - 로고 5회 빠르게 클릭 시 관리자 로그인 페이지 이동

---

## 스택

| 영역 | 기술 |
|------|------|
| Frontend | Vue 3 (Composition API), Vue Router, Pinia, Axios, Tailwind CSS v4 |
| Backend | Node.js, Express 5, Prisma v7 (PrismaPg), PostgreSQL |
| 인증 | JWT (bcrypt + jsonwebtoken) |
| 스토리지 | AWS S3 (Multer) |
| 배포 | Vercel (Frontend), Railway (Backend + DB) |

---

## 폴더 구조

```
folio/
├── frontend/
│   └── src/
│       ├── api/                # Axios 인스턴스 + API 함수
│       ├── assets/             # style.css (Tailwind)
│       ├── pages/
│       │   ├── Home.vue        # 폴더 랜딩 + 파일 탐색 SPA
│       │   ├── Projects.vue
│       │   ├── ProjectDetail.vue
│       │   ├── About.vue
│       │   └── admin/
│       │       ├── Login.vue
│       │       ├── ProjectList.vue
│       │       └── ProjectForm.vue
│       ├── router/
│       └── stores/             # Pinia (auth, projects)
│
└── backend/
    ├── generated/              # Prisma Client (자동 생성)
    └── src/
        ├── lib/prisma.js
        ├── middleware/authMiddleware.js
        ├── prisma/
        │   ├── schema.prisma
        │   ├── migrations/
        │   └── seed.js
        ├── routes/
        │   ├── auth.js
        │   ├── projects.js
        │   └── upload.js
        └── index.js
```

---

## 시작하기

### 요구사항

- Node.js 18+
- PostgreSQL
- AWS 계정 (S3 버킷)

### 1. 클론

```bash
git clone https://github.com/robincooding/folio.git
cd folio
```

### 2. 환경변수

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

### 3. 설치

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. DB 마이그레이션 + 시드

```bash
cd backend
npx prisma migrate dev
npx prisma generate
node src/prisma/seed.js
```

### 5. 개발 서버

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
| `/` | 홈 — 폴더 랜딩 + 파일 넘겨보기 탐색 |
| `/projects` | 프로젝트 목록 (카테고리 필터) |
| `/projects/:id` | 프로젝트 상세 (이미지 갤러리, 링크) |
| `/about` | 소개 |
| `/admin/login` | 관리자 로그인 |
| `/admin/projects` | 프로젝트 관리 (CRUD) |
| `/admin/projects/new` | 프로젝트 등록 |
| `/admin/projects/:id/edit` | 프로젝트 수정 |

---

## API

### Public

```
GET  /api/projects          # 목록 조회 (?category=app|web|other)
GET  /api/projects/:id      # 상세 조회
GET  /api/health            # 서버 상태
```

### Admin (JWT 필요)

```
POST   /api/auth/login        # 로그인 → JWT 발급
POST   /api/projects          # 등록
PUT    /api/projects/:id      # 수정
DELETE /api/projects/:id      # 삭제
POST   /api/upload            # 이미지 업로드 → S3 URL
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
  section      String         @default("General")
  displayOrder Int            @default(0)
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
  project   Project @relation(...)
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

1. GitHub 레포 연결
2. Root Directory: `frontend`
3. Framework Preset: Vite
4. 환경변수: `VITE_API_BASE_URL=https://<railway-도메인>/api`

### Railway (Backend + DB)

1. GitHub 레포 연결
2. Root Directory: `backend`
3. PostgreSQL 서비스 추가, `DATABASE_URL` 연결
4. 환경변수 설정
5. Build: `npm install && npx prisma generate`
6. Start: `npx prisma migrate deploy && npm start`
7. 시드 (로컬):
   ```bash
   DATABASE_URL=<PUBLIC_URL> node src/prisma/seed.js
   ```

---

## 라이선스

MIT
