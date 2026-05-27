frontend/
├─ index.html
├─ package.json
├─ vite.config.ts (or js)
├─ tsconfig.json
├─ Dockerfile
├─ nginx/
│  └─ default.conf
│
└─ src/
   ├─ main.tsx
   ├─ App.tsx
   ├─ index.css
   ├─ App.css
   │
   ├─ components/
   │  ├─ Header.tsx
   │  └─ ProtectedRoute.tsx
   │
   ├─ layout/
   │  ├─ Layout.tsx
   │  └─ EmptyLayout.tsx
   │
   ├─ pages/
   │  ├─ Main.tsx
   │  ├─ Home.tsx
   │  ├─ About.tsx
   │  ├─ Contact.tsx
   │  ├─ Dashboard.tsx
   │  └─ Login.tsx
   │
   ├─ assets/
   │  └─ (images, svg 등)
   │
   └─ api/ (있다면)
      └─ (axios, fetch 모음)
