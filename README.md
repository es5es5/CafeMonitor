# 🧭 Monika - 네이버 카페 게시글 모니터링 시스템

> 특정 키워드가 포함된 **네이버 카페 게시글**을 **로그인 없이 자동 감지**하는 크롤링 도구입니다.

---

## 🔍 주요 목적

- 네이버 카페에서 **우리 학원, 브랜드, 상품**과 관련된 **게시글을 실시간으로 감시**합니다.
- 예: '청담어학원', 'CMS', '영어유치원' 같은 **지정 키워드**가 포함된 제목을 필터링합니다.
- 게시글을 확인한 시점 이후의 **신규 게시물만 추적**하며, **중복 없이 관리**할 수 있습니다.

---

## 🧠 핵심 기능

| 기능                | 설명                                                                       |
| ------------------- | -------------------------------------------------------------------------- |
| 🔍 키워드 필터링    | 게시글 제목/내용에서 키워드 포함 여부 필터링                               |
| 🧠 이진 탐색        | 기준 날짜 이후 게시글이 처음 등장하는 페이지를 빠르게 찾아 시작점으로 사용 |
| ⚡ 빠른 병렬 크롤링 | 여러 페이지를 병렬로 요청하며 속도 향상 + 랜덤 지연으로 차단 방지          |
| 💾 엑셀 파일 저장   | `[키워드]_YYYYMMDDHHmm` 형식으로 UTF-8-BOM 인코딩 저장                     |

---

## 💬 향후 기능 계획

- [ ] 결과를 **구글 스프레드시트에 자동 저장**
- [ ] 알림 기능 (Slack, 이메일 등)
- [ ] 웹 UI 또는 Electron 앱 패키징
- [ ] 크롤링 대상 카페/키워드 실시간 설정 기능

---

## 📎 만든 이유

- 모니카는 우리 브랜드/학원/서비스 이름이 온라인 커뮤니티(네이버 카페 등)에 어떻게 언급되고 있는지 실시간으로 확인하기 위한 모니터링 도구입니다.
- 사내 담당자가 일일이 검색하지 않아도, 자동으로 최신 글을 추적할 수 있게 해줍니다.

---

## ⚙️ 기술 스택

- **TypeScript** - 엄격한 타입 검사를 통한 안정성 확보
- **Node.js** - 실행 환경 (v20+)
<!-- - **Google Spreadsheet API** (계획 중) - 수집 결과 자동 저장용 -->

---
