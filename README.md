# dongdong-admin-web

## DongDong Admin Web (Backoffice)

### 목적

- WebView(`dongdong-client`)와 **분리된** 관리자 웹(웹 1개).
- 디자인보다 “데이터를 직관적으로 보고 조치”하는 관제형 UI.

### 요구사항/SSOT

- 백엔드 Admin SSOT: `docs/DONGDONG_ADMIN_WEB_ARCHITECTURE_SSOT_v1.0-2026-01-15.md`
- 요구사항 시트(보기 전용): [`동동_관리자웹`](https://docs.google.com/spreadsheets/d/1XYeugW5jeF8uVJ2u4gx4Cprib4zIwEO4T-LlV0qBd2U/edit?gid=1755659268#gid=1755659268)

### 환경변수

- `NEXT_PUBLIC_API_URL` (기본: `http://api.dongdong.io:3000/api/v1`)

### 실행(로컬)

```bash
npm i
npm run dev
```

### 로그인

- `/login`에서 **이메일 로그인**(`POST /api/v1/auth/login`) 사용
- 응답의 `user.role === "ADMIN"`만 통과

### 주의(보안)

- v0.1은 빠른 관제 목적이라 access token을 localStorage에 보관한다.
- 운영 전환 시에는 **HttpOnly cookie 기반 세션**으로 변경 권장.
