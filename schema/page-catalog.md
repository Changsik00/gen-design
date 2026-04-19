# Page Catalog

> 앱에서 흔히 사용되는 페이지 유형을 카테고리별로 정리한 카탈로그.
> Blueprint 질의서(spec-3-002)와 REQUIREMENTS.md 생성의 기초 데이터로 활용한다.
>
> **범례**: ✅ 구현 완료 (Phase 2) | ⬜ 미구현

---

## 요약 테이블

| # | 카테고리 | 페이지 | ID | variant | Template 상태 |
|---|---|---|---|---|---|
| 1 | auth | Login | `auth-login` | page, modal, bottom-sheet | ✅ LoginPage |
| 2 | auth | Signup | `auth-signup` | page, modal, bottom-sheet | ✅ SignupPage |
| 3 | auth | Forgot Password | `auth-forgot-pw` | page, modal | ⬜ |
| 4 | auth | Verify / OTP | `auth-verify` | page, modal | ⬜ |
| 5 | dashboard | Overview | `dash-overview` | page | ✅ DashboardPage |
| 6 | dashboard | Analytics | `dash-analytics` | page | ⬜ |
| 7 | profile | My Page | `profile-mypage` | page | ⬜ |
| 8 | profile | Settings | `profile-settings` | page | ⬜ |
| 9 | content | List | `content-list` | page | ⬜ |
| 10 | content | Detail | `content-detail` | page, modal | ⬜ |
| 11 | content | Search | `content-search` | page, modal | ⬜ |
| 12 | commerce | Cart | `commerce-cart` | page, bottom-sheet | ⬜ |
| 13 | commerce | Checkout | `commerce-checkout` | page | ⬜ |
| 14 | commerce | Order History | `commerce-orders` | page | ⬜ |
| 15 | common | Landing | `common-landing` | page | ⬜ |
| 16 | common | Onboarding | `common-onboarding` | page, modal | ⬜ |
| 17 | common | Error (404/500) | `common-error` | page | ⬜ |
| 18 | common | Notifications | `common-notifications` | page, bottom-sheet | ⬜ |

---

## 카테고리별 상세

### 1. auth — 인증

사용자 인증과 계정 관리에 관련된 페이지.

#### auth-login — 로그인 ✅

- **Template**: `LoginPage` (Phase 2 구현 완료)
- **variant**: page (split-screen), modal, bottom-sheet
- **필수 섹션**:
  - BrandHeader — 로고, 앱 이름 (토큰 슬롯)
  - LoginForm — 이메일/비밀번호 입력 (Composite)
  - SocialAuthBlock — 소셜 로그인 버튼 그룹 (Composite)
- **선택 섹션**:
  - ForgotPasswordLink — 비밀번호 찾기 링크
  - SignupPrompt — 회원가입 유도 텍스트
  - FooterLinks — 약관/개인정보 링크
  - RememberMe — 로그인 상태 유지 체크박스

#### auth-signup — 회원가입 ✅

- **Template**: `SignupPage` (Phase 2 구현 완료)
- **variant**: page, modal, bottom-sheet
- **필수 섹션**:
  - BrandHeader — 로고, 앱 이름
  - SignupForm — 이름/이메일/비밀번호/확인 (Composite)
- **선택 섹션**:
  - SocialAuthBlock — 소셜 회원가입
  - TermsAgreement — 약관 동의 체크박스
  - LoginPrompt — 로그인 유도 텍스트
  - PasswordStrength — 비밀번호 강도 표시

#### auth-forgot-pw — 비밀번호 찾기

- **variant**: page, modal
- **필수 섹션**:
  - BrandHeader — 로고
  - EmailInputForm — 이메일 입력 + 전송 버튼
  - BackToLogin — 로그인 복귀 링크
- **선택 섹션**:
  - InstructionText — 안내 문구
  - SuccessConfirmation — 전송 완료 확인 화면

#### auth-verify — 인증 코드 확인

- **variant**: page, modal
- **필수 섹션**:
  - BrandHeader — 로고
  - OTPInput — 인증 코드 입력 (4~6자리)
  - SubmitButton — 확인 버튼
- **선택 섹션**:
  - ResendLink — 재전송 링크 + 타이머
  - InstructionText — 안내 문구 (이메일/SMS 확인 요청)

---

### 2. dashboard — 대시보드

데이터 요약과 분석을 위한 관리 화면.

#### dash-overview — 대시보드 개요 ✅

- **Template**: `DashboardPage` (Phase 2 구현 완료)
- **variant**: page
- **필수 섹션**:
  - DashboardHeader — 제목 + 검색 + 사용자 아바타
  - Sidebar — 내비게이션 메뉴
  - StatCardGrid — 주요 지표 카드 그리드 (Composite)
  - ActivityTable — 최근 활동 테이블 (Composite)
- **선택 섹션**:
  - ChartArea — 차트/그래프 영역
  - QuickActions — 빠른 실행 버튼 그룹
  - NotificationBanner — 상단 알림 배너

#### dash-analytics — 분석 상세

- **variant**: page
- **필수 섹션**:
  - DashboardHeader — 제목 + 기간 필터
  - Sidebar — 내비게이션 메뉴
  - ChartGrid — 다중 차트 레이아웃 (line, bar, pie 등)
  - FilterBar — 데이터 필터 (날짜, 카테고리, 상태)
- **선택 섹션**:
  - DataTable — 상세 데이터 테이블
  - ExportButton — CSV/PDF 내보내기
  - ComparisonToggle — 기간 비교 토글

---

### 3. profile — 프로필/설정

사용자 개인 정보 관리.

#### profile-mypage — 마이페이지

- **variant**: page
- **필수 섹션**:
  - ProfileHeader — 아바타 + 이름 + 역할
  - ProfileInfoCard — 기본 정보 (이메일, 가입일 등)
  - ActivitySummary — 활동 요약 (게시물 수, 댓글 수 등)
- **선택 섹션**:
  - AvatarUpload — 프로필 사진 변경
  - RecentActivity — 최근 활동 목록
  - BadgeList — 획득 배지/업적

#### profile-settings — 설정

- **variant**: page
- **필수 섹션**:
  - SettingsNav — 설정 카테고리 네비게이션 (탭 또는 사이드)
  - AccountSection — 계정 정보 수정 (이름, 이메일, 비밀번호)
  - NotificationSection — 알림 설정 (이메일, 푸시, SMS)
- **선택 섹션**:
  - ThemeSection — 테마 설정 (라이트/다크)
  - LanguageSection — 언어 설정
  - DangerZone — 계정 삭제/비활성화
  - ConnectedApps — 연결된 외부 서비스

---

### 4. content — 콘텐츠

데이터 목록, 상세, 검색.

#### content-list — 목록

- **variant**: page
- **필수 섹션**:
  - PageHeader — 제목 + 액션 버튼 (추가/필터)
  - FilterBar — 검색 + 필터 (상태, 카테고리, 날짜)
  - ItemList — 항목 목록 (카드 또는 테이블)
  - Pagination — 페이지네이션 또는 무한 스크롤
- **선택 섹션**:
  - BulkActions — 다중 선택 액션
  - ViewToggle — 카드/테이블 뷰 전환
  - SortDropdown — 정렬 옵션
  - EmptyState — 데이터 없음 상태

#### content-detail — 상세

- **variant**: page, modal
- **필수 섹션**:
  - DetailHeader — 제목 + 메타 정보 (작성자, 날짜)
  - DetailBody — 본문 콘텐츠 영역
  - ActionBar — 수정/삭제/공유 버튼
- **선택 섹션**:
  - CommentSection — 댓글/토론
  - RelatedItems — 관련 항목
  - Breadcrumb — 경로 표시
  - TagList — 태그/라벨

#### content-search — 검색

- **variant**: page, modal
- **필수 섹션**:
  - SearchInput — 검색 입력 (자동완성)
  - SearchResults — 결과 목록
  - ResultCount — 결과 수 표시
- **선택 섹션**:
  - FilterSidebar — 필터 사이드바
  - RecentSearches — 최근 검색어
  - SearchSuggestions — 추천 검색어

---

### 5. commerce — 커머스

쇼핑 및 주문 관련 페이지.

#### commerce-cart — 장바구니

- **variant**: page, bottom-sheet
- **필수 섹션**:
  - CartItemList — 상품 목록 (이미지, 수량, 가격)
  - CartSummary — 합계 (소계, 배송비, 할인, 총액)
  - CheckoutButton — 결제 진행 버튼
- **선택 섹션**:
  - CouponInput — 쿠폰/할인코드 입력
  - RecommendedItems — 추천 상품
  - EmptyCart — 빈 장바구니 상태

#### commerce-checkout — 결제

- **variant**: page
- **필수 섹션**:
  - StepIndicator — 결제 단계 표시 (배송 → 결제 → 확인)
  - ShippingForm — 배송 정보 입력
  - PaymentForm — 결제 수단 선택/입력
  - OrderSummary — 주문 요약 (상품, 금액)
- **선택 섹션**:
  - SavedAddresses — 저장된 주소 선택
  - SavedPayments — 저장된 결제 수단
  - GiftOption — 선물 옵션

#### commerce-orders — 주문 내역

- **variant**: page
- **필수 섹션**:
  - OrderList — 주문 목록 (날짜, 상태, 금액)
  - OrderStatusBadge — 상태 표시 (결제완료, 배송중, 완료)
  - OrderDetail — 주문 상세 보기 (펼침/클릭)
- **선택 섹션**:
  - FilterBar — 기간/상태 필터
  - TrackingLink — 배송 추적
  - ReorderButton — 재주문

---

### 6. common — 공통

앱 전반에서 사용되는 범용 페이지.

#### common-landing — 랜딩

- **variant**: page
- **필수 섹션**:
  - HeroSection — 메인 비주얼 + CTA
  - FeatureGrid — 주요 기능 소개 (3~4개 카드)
  - CTASection — 가입/시작 유도
- **선택 섹션**:
  - TestimonialSection — 사용자 후기
  - PricingTable — 가격 플랜
  - FAQSection — 자주 묻는 질문
  - FooterSection — 하단 링크 + 소셜

#### common-onboarding — 온보딩

- **variant**: page, modal
- **필수 섹션**:
  - StepIndicator — 현재 단계 표시
  - StepContent — 단계별 콘텐츠 (소개, 설정, 권한 요청 등)
  - NavigationButtons — 이전/다음/건너뛰기
- **선택 섹션**:
  - ProgressBar — 진행률 바
  - IllustrationArea — 단계별 일러스트/애니메이션
  - SkipAll — 전체 건너뛰기

#### common-error — 에러 (404/500)

- **variant**: page
- **필수 섹션**:
  - ErrorIcon — 에러 일러스트 또는 아이콘
  - ErrorMessage — 에러 코드 + 설명 텍스트
  - HomeButton — 홈으로 돌아가기 버튼
- **선택 섹션**:
  - SearchBox — 페이지 검색
  - SuggestedLinks — 추천 링크
  - ReportButton — 문제 신고

#### common-notifications — 알림

- **variant**: page, bottom-sheet
- **필수 섹션**:
  - NotificationList — 알림 목록 (읽음/안읽음 구분)
  - NotificationItem — 개별 알림 (아이콘, 제목, 시간)
  - MarkAllRead — 전체 읽음 처리
- **선택 섹션**:
  - FilterTabs — 카테고리 필터 (전체, 멘션, 시스템)
  - NotificationSettings — 알림 설정 바로가기
  - EmptyState — 알림 없음 상태

---

## 앱 유형별 추천 세트

각 앱 유형에 맞는 권장 페이지 조합. **필수(●)** / **권장(○)** / **선택(△)** 표기.

### SaaS (B2B 서비스)

| 페이지 | 필요도 | 권장 variant |
|---|:---:|---|
| auth-login | ● | modal |
| auth-signup | ● | page |
| auth-forgot-pw | ○ | modal |
| dash-overview | ● | page |
| dash-analytics | ○ | page |
| profile-settings | ● | page |
| content-list | ○ | page |
| common-error | ● | page |
| common-onboarding | ○ | modal |

### E-commerce (쇼핑몰)

| 페이지 | 필요도 | 권장 variant |
|---|:---:|---|
| auth-login | ● | modal |
| auth-signup | ● | page |
| commerce-cart | ● | bottom-sheet (모바일), page (데스크톱) |
| commerce-checkout | ● | page |
| commerce-orders | ● | page |
| content-list | ● | page (상품 목록) |
| content-detail | ● | page (상품 상세) |
| content-search | ● | page |
| common-landing | ● | page |
| common-error | ● | page |
| profile-mypage | ○ | page |
| common-notifications | △ | bottom-sheet |

### Social (소셜/커뮤니티)

| 페이지 | 필요도 | 권장 variant |
|---|:---:|---|
| auth-login | ● | page |
| auth-signup | ● | page |
| auth-verify | ○ | modal |
| profile-mypage | ● | page |
| profile-settings | ● | page |
| content-list | ● | page (피드) |
| content-detail | ● | page (게시물 상세) |
| content-search | ● | page |
| common-notifications | ● | bottom-sheet |
| common-onboarding | ○ | page |
| common-error | ● | page |

### Content (콘텐츠/미디어/블로그)

| 페이지 | 필요도 | 권장 variant |
|---|:---:|---|
| auth-login | ○ | modal |
| auth-signup | ○ | modal |
| content-list | ● | page |
| content-detail | ● | page |
| content-search | ● | page |
| common-landing | ● | page |
| common-error | ● | page |
| profile-mypage | △ | page |
| common-notifications | △ | bottom-sheet |

### Utility (도구/유틸리티)

| 페이지 | 필요도 | 권장 variant |
|---|:---:|---|
| auth-login | ● | page |
| auth-signup | ● | page |
| dash-overview | ○ | page |
| profile-settings | ● | page |
| common-error | ● | page |
| common-onboarding | ● | page |
| common-notifications | △ | bottom-sheet |

---

## Phase 2 Template 매핑 요약

| 카탈로그 항목 | Phase 2 Template | 상태 |
|---|---|---|
| `auth-login` | `LoginPage` | ✅ page + modal + bottom-sheet |
| `auth-signup` | `SignupPage` | ✅ page + modal + bottom-sheet |
| `dash-overview` | `DashboardPage` | ✅ page only |
| 그 외 15종 | — | ⬜ 미구현 |

> Phase 5(PoC 검증)에서 추가 Template 구현 우선순위를 결정한다.
