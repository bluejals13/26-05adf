
* 아래처럼 README에 **CSS 책임 범위와 연결 규칙**을 표로 정리해두면 팀원이 봐도 바로 이해할 수 있습니다.


# Frontend Style Architecture

## CSS / Style 관리 기준

| 구분 | 위치 | 담당 범위 | 포함 내용 | 사용 기준 |
|---|---|---|---|---|
| Global Style | `src/styles/` | 전체 앱 공통 | reset, font, color, 변수, body | 모든 페이지 자동 적용 |
| Common Component | `src/components/common/` | 재사용 UI | Button, Input, Modal, Table | 2개 이상 화면에서 사용 |
| Layout Component | `src/components/layout/` | 화면 구조 | Header, Footer, Sidebar | 전체 앱 구조 담당 |
| Feature Style | `src/features/{feature}/` | 기능 단위 | Auth, Menu, Role 등 | 특정 도메인에서만 사용 |
| Page Style | `src/pages/{page}/` | 페이지 배치 | 화면 구조, grid, section | 단일 페이지 전용 |



# Style 연결 규칙

| 기능 | 위치 | CSS 파일 | 적용 범위 |
|---|---|---|---|
| Login / Signup | `features/auth` | `Auth.css` | 인증 화면 |
| Header | `components/layout/Header` | `Header.css` | 전체 Header |
| Footer | `components/layout/Footer` | `Footer.css` | 전체 Footer |
| Button | `components/common/Button` | `Button.css` | 모든 버튼 |
| Input | `components/common/Input` | `Input.css` | 모든 입력창 |
| Table | `components/common/Table` | `Table.css` | 모든 테이블 |
| Dashboard | `pages/Dashboard` | `Dashboard.css` | Dashboard 전용 |
| User Admin | `pages/Admin` | `Admin.css` | 관리자 화면 |
| Role 관리 | `features/role` | `Role.css` | 권한 관리 |
| Menu 관리 | `features/menu` | `Menu.css` | 메뉴 관리 |



# CSS 이동 기준

| 현재 CSS | 이동 위치 | 이유 |
|---|---|---|
| body, font, color | `styles/global.css` | 전체 공통 |
| --color, radius | `styles/variables.css` | 디자인 토큰 |
| button 스타일 | `common/Button` | 재사용 |
| input 스타일 | `common/Input` | 재사용 |
| table row/header | `common/Table` | 반복 UI |
| page padding | Page CSS | 화면별 차이 |
| grid column | Page CSS | 데이터별 차이 |
| modal | `common/Modal` | 공통 UI |



# Component 사용 원칙

## Common Component

사용:

```tsx
<Button variant="danger">
 Delete
</Button>
````

관리:

```
components/common/Button
```



## Page CSS

허용:

```css
.user-page {
 display:grid;
 grid-template-columns:200px 1fr;
}
```

금지:

```css
.user-page button {
 background:red;
}
```

버튼 디자인은 Button Component 담당.



# Admin 계열 페이지 기준

| 화면     | 담당 CSS                |
| ------ | --------------------- |
| 사용자 목록 | Admin.css + Table.css |
| 권한 관리  | Role.css + Table.css  |
| 메뉴 관리  | Menu.css + Table.css  |
| 상태 표시  | Status Component      |
| 삭제 버튼  | Button danger variant |



# CSS 작성 우선순위

1. Global Style 확인
2. Common Component 확인
3. Feature Style 작성
4. Page Style 작성



# 금지 사항

❌ 페이지마다 동일한 Button CSS 생성

```css
.deleteBtn {}
.primaryBtn {}
.submitBtn {}
```

대신:

```tsx
<Button variant="danger"/>
<Button variant="primary"/>
```

사용

❌ 모든 CSS를 App.css 관리

```
App.css
 ├ Header
 ├ Button
 ├ Table
 ├ Admin
 └ Login
```

금지



# 최종 구조

src/

```
styles
 ├ global.css
 └ variables.css

components
 ├ common
 │ ├ Button
 │ ├ Input
 │ └ Table
 │
 └ layout
   ├ Header
   └ Footer

features
 ├ auth
 ├ menu
 └ role

pages
 ├ Dashboard
 ├ Admin
 └ Login
```



## 핵심 원칙

> 반복되는 UI는 Common Component
> 특정 기능 UI는 Feature
> 화면 배치는 Page
> 전체 디자인 규칙은 Global

```

이 정도를 README에 넣으면 현재 프로젝트의 CSS 정리 기준을 유지하기 좋습니다. 특히 나중에 Tailwind를 일부 도입하더라도 이 구조 기준은 그대로 유지할 수 있습니다.
```
