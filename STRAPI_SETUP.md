# Strapi CMS Setup Guide

이 프로젝트는 Strapi CMS를 사용하여 이벤트 콘텐츠를 관리합니다.

## 1. Strapi 설치

### 새 Strapi 프로젝트 생성

```bash
# 프로젝트 루트에서 Strapi 설치
npx create-strapi-app@latest strapi-cms --quickstart

# 또는 기존 데이터베이스 사용
npx create-strapi-app@latest strapi-cms
```

### Strapi 실행

```bash
cd strapi-cms
npm run develop
```

브라우저에서 `http://localhost:1337/admin`으로 접속하여 관리자 계정을 생성하세요.

## 2. Events Content Type 생성

Strapi 관리자 패널에서:

1. **Content-Type Builder** → **Create new collection type**
2. Display name: `Event`
3. 다음 필드들을 추가하세요:

### 필드 설정

<!-- 카테고리 항목은 불필요하여 제거 -->

| Field Name  | Type      | Options                      |
| ----------- | --------- | ---------------------------- |
| title       | Text      | Required, Unique             |
| slug        | UID       | Attached to: title, Required |
| date        | Date      | Required                     |
| description | Text      | Long text, Required          |
| content     | Rich Text | Required                     |
| tags        | JSON      | -                            |
| published   | Boolean   | Default: false               |
| thumbnail   | Media     | Single image                 |
| images      | Media     | Multiple images              |

### Videos Component

-> Youtube 링크 넣으면 임베딩되도록 수정

<!-- 1. **Create new component** → Category: `media`, Name: `video`
2. 필드 추가:
   - `url` (Text, Required)
   - `title` (Text, Optional)

3. Events에 videos 필드 추가:
   - Type: Component
   - Select: media.video
   - Repeatable: Yes -->

## 3. Permissions 설정

### Public 권한 (Settings → Roles → Public)

다음 API 엔드포인트를 활성화:

- **Events**
  - `find` ✓
  - `findOne` ✓

### Authenticated 권한 (Settings → Roles → Authenticated)

관리자용 권한:

- **Events**

  - `find` ✓
  - `findOne` ✓
  - `create` ✓
  - `update` ✓
  - `delete` ✓

- **Upload**
  - `upload` ✓

## 4. API Token 생성

1. **Settings** → **API Tokens** → **Create new API Token**
2. Name: `Next.js App`
3. Token type: `Read-Only` (또는 `Full access` for admin features)
4. Token duration: `Unlimited`
5. 생성된 토큰을 복사하여 `.env.local`에 추가:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_token_here
```

## 5. i18n 설정 (다국어 지원)

1. **Settings** → **Internationalization**
2. 로케일 추가:

   - Korean (ko)
   - English (en)

3. Events Content Type 설정:
   - **Advanced Settings** → **Enable localization**

## 6. 샘플 이벤트 생성

1. **Content Manager** → **Event** → **Create new entry**
2. 필드를 채우고 **Publish**

예시:

```
Title: Walk & Peace 2025
Slug: walk-and-peace-2025
Date: 2025-03-21
Description: A peaceful march through Busan...
Category: Campaign
Tags: ["WalkAndPeace", "March", "Community"]
Content: <rich text content>
Published: Yes
Locale: ko
```

## 7. Next.js 앱 연동

### 환경 변수 확인

`.env.local` 파일이 올바르게 설정되었는지 확인:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_actual_token_here
```

### 앱 실행

```bash
npm run dev
```

이제 다음 페이지에서 Strapi 데이터를 확인할 수 있습니다:

- Timeline: `http://localhost:3000/ko/timeline`
- Event Detail: `http://localhost:3000/ko/events/[slug]`
- Admin Panel: `http://localhost:3000/ko/admin/events`

## 8. 블로그 에디터 사용하기

### 새 이벤트 생성

1. `http://localhost:3000/ko/admin/events/new` 접속
2. 폼을 작성하고 "Create Event" 클릭
3. TipTap 에디터로 리치 텍스트 콘텐츠 작성

### 이벤트 관리

1. `http://localhost:3000/ko/admin/events` 접속
2. 이벤트 목록 확인
3. Edit, Delete 버튼으로 관리

## 9. 프로덕션 배포

### Strapi 배포

Strapi를 별도로 배포하고 URL을 환경 변수에 설정:

```env
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-domain.com
STRAPI_API_TOKEN=production_token
```

### CORS 설정

Strapi의 `config/middlewares.js`에서 CORS 설정:

```javascript
module.exports = [
  // ...
  {
    name: "strapi::cors",
    config: {
      origin: ["https://your-nextjs-domain.com"],
    },
  },
  // ...
];
```

## 트러블슈팅

### Strapi 연결 실패

- Strapi가 실행 중인지 확인 (`http://localhost:1337`)
- `.env.local`의 URL이 올바른지 확인
- API Token이 올바르게 설정되었는지 확인

### 이미지 업로드 문제

- Strapi의 Upload 플러그인 권한 확인
- 파일 크기 제한 확인

### 빈 데이터

- 이벤트가 Published 상태인지 확인
- Public 권한에서 find, findOne이 활성화되었는지 확인
- Populate 파라미터가 올바른지 확인

## 참고 자료

- [Strapi Documentation](https://docs.strapi.io/)
- [TipTap Editor](https://tiptap.dev/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
