# UNs Digital Hub - CMS 기능

Strapi CMS를 사용한 이벤트 콘텐츠 관리 시스템이 추가되었습니다.

## 주요 기능

### ✅ 완료된 기능

1. **Strapi CMS 연동**
   - Events Collection Type
   - 다국어 지원 (한국어/영어)
   - 미디어 관리 (이미지, 비디오)

2. **리치 텍스트 에디터 (TipTap)**
   - Bold, Italic, Strike through
   - Headings (H1, H2, H3)
   - Lists (Bullet, Ordered)
   - Blockquote, Code blocks
   - Links, Images
   - Horizontal rules

3. **관리자 페이지**
   - 이벤트 생성: `/[locale]/admin/events/new`
   - 이벤트 목록: `/[locale]/admin/events`
   - CRUD 작업 지원

4. **API 라우트**
   - `GET /api/events` - 전체 이벤트 목록
   - `POST /api/events` - 새 이벤트 생성
   - `PUT /api/events/[id]` - 이벤트 수정
   - `DELETE /api/events/[id]` - 이벤트 삭제
   - `POST /api/upload` - 미디어 업로드

5. **자동 폴백**
   - Strapi를 사용할 수 없을 때 Mock 데이터 자동 사용
   - 개발 환경에서 유연한 작업 가능

## 시작하기

### 1. Strapi 설정

자세한 설정 가이드는 [STRAPI_SETUP.md](./STRAPI_SETUP.md)를 참조하세요.

간단 요약:
```bash
# Strapi 설치
npx create-strapi-app@latest strapi-cms --quickstart

# Strapi 실행
cd strapi-cms
npm run develop
```

### 2. 환경 변수 설정

`.env.local` 파일:
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_api_token_here
```

### 3. Next.js 앱 실행

```bash
npm run dev
```

## 사용 방법

### 새 이벤트 작성

1. `http://localhost:3000/ko/admin/events/new` 접속
2. 필수 정보 입력:
   - 제목 (자동으로 Slug 생성)
   - 날짜
   - 카테고리
   - 설명
3. TipTap 에디터로 본문 작성
4. 태그 추가 (쉼표로 구분)
5. "Publish immediately" 체크 (즉시 게시)
6. "Create Event" 클릭

### 이벤트 관리

1. `http://localhost:3000/ko/admin/events` 접속
2. 이벤트 목록 확인
3. 액션:
   - **View**: 공개 페이지에서 미리보기
   - **Edit**: 수정 (예정)
   - **Delete**: 삭제

### 공개 페이지

- **타임라인**: `/ko/timeline` - 전체 이벤트 타임라인
- **이벤트 상세**: `/ko/events/[slug]` - 개별 이벤트 페이지

## 파일 구조

```
uns-digital-hub/
├── app/
│   ├── api/
│   │   ├── events/
│   │   │   ├── route.ts          # Events API
│   │   │   └── [id]/route.ts     # Event CRUD API
│   │   └── upload/route.ts       # Media upload API
│   └── [locale]/
│       ├── admin/
│       │   └── events/
│       │       ├── page.tsx      # Admin list
│       │       └── new/page.tsx  # Admin editor
│       ├── events/[id]/page.tsx  # Event detail (updated)
│       └── timeline/page.tsx     # Timeline (updated)
├── components/
│   └── editor/
│       └── RichTextEditor.tsx    # TipTap editor
├── lib/
│   ├── api/
│   │   └── events.ts             # Event API functions
│   └── strapi.ts                 # Strapi client
├── types/
│   └── strapi.ts                 # Strapi types
├── docs/
│   └── STRAPI_CONTENT_TYPE.json  # Content type schema
├── .env.local                    # Environment vars
├── STRAPI_SETUP.md              # Strapi setup guide
└── README_CMS.md                # This file
```

## 기술 스택

- **CMS**: Strapi v4
- **에디터**: TipTap (React)
- **API**: Next.js API Routes
- **타입**: TypeScript
- **스타일**: Tailwind CSS

## 다음 단계

### 추가 가능한 기능

1. **이벤트 편집 페이지**
   - `/admin/events/[id]/edit` 페이지 생성

2. **이미지 업로드 UI**
   - 드래그 앤 드롭 업로더
   - 이미지 갤러리 관리

3. **태그 필터링**
   - 태그별 이벤트 필터
   - 태그 자동완성

4. **검색 기능**
   - 제목/내용 검색
   - 카테고리 필터

5. **권한 관리**
   - 로그인/인증
   - 역할 기반 접근 제어

6. **미리보기**
   - Draft 모드
   - 게시 전 미리보기

## 트러블슈팅

### Strapi 연결 오류

```
Error: connect ECONNREFUSED 127.0.0.1:1337
```

**해결책**: Strapi가 실행 중인지 확인하세요.

### 빈 이벤트 목록

**확인사항**:
- Strapi에서 이벤트가 Published 상태인가?
- API Token이 올바른가?
- Public 권한이 설정되었는가?

### 에디터 스타일 문제

TipTap 에디터 스타일이 적용되지 않으면 `globals.css`의 `.ProseMirror` 스타일을 확인하세요.

## 참고 자료

- [Strapi 문서](https://docs.strapi.io/)
- [TipTap 문서](https://tiptap.dev/)
- [Next.js 문서](https://nextjs.org/docs)
