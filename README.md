# منظومة «صحة» للرياضيين | Seha SportsMed Platform

React 19 + Vite web application converted from the standalone prototype to match the architecture, modularity, and standards of the `labcertify` project in `C:\Users\USER\Documents`.

## 📌 نظرة عامة | Overview
منظومة وطنية متكاملة للحجز الإلكتروني والشهادات الطبية الرياضية الموثقة رقميًا للرياضيين والناشئين في مصر وفق الكود الطبي المعتمد بـ **قرار 1642 / 2024** الصادر عن وزارة الصحة والسكان — المؤسسة العلاجية (إدارة نظم المعلومات والتحول الرقمي).

## 🚀 التشغيل السريع | Quick Start

```bash
cd C:\Users\USER\Documents\seha-sports
npm install
npm run dev
```

التطبيق يعمل افتراضيًا على: `http://localhost:3001/`

لإنشاء نسخة الإنتاج (Production Build):
```bash
npm run build
```

---

## 🏗️ هيكلية المشروع | Project Structure

```
seha-sports/
├── index.html                           # HTML entry with Google Fonts (Cairo, Noto Sans Arabic, Inter)
├── package.json                         # Dependencies (React 19, Lucide React, Tailwind v4, Vite 6)
├── vite.config.js                       # Vite configuration with @ path alias & plugins
├── src/
│   ├── main.jsx                         # Root entry with Theme, Language & Seha providers
│   ├── App.jsx                          # Main shell coordinating topbar, sidebar, modals & views
│   ├── index.css                        # Tailwind v4 directives, medical design tokens & A4 print CSS
│   ├── context/
│   │   ├── LanguageContext.jsx          # Bilingual AR/EN toggle, RTL/LTR layout synchronization
│   │   ├── ThemeContext.jsx             # Light & Dark mode support
│   │   └── SehaContext.jsx              # Central reactive state (players, clubs, hospitals, consents, audit)
│   ├── data/
│   │   ├── mockData.js                  # Deterministic generator (200 players, clubs, shifts, decree config)
│   │   └── translations.js              # Complete English & Arabic translation dictionaries
│   ├── components/
│   │   ├── Common/
│   │   │   ├── SehaLogo.jsx             # Vector SVG logo with pulse animation
│   │   │   ├── QRCodeSVG.jsx            # Deterministic QR code SVG generator
│   │   │   ├── KPICard.jsx              # KPI metric cards with accent indicator stripes
│   │   │   ├── StatusTag.jsx            # Badges for player status, accreditation & consents
│   │   │   └── Toast.jsx                # Toast notifications
│   │   ├── Navigation/
│   │   │   ├── TopNavBar.jsx            # Brand, decree badge, breadcrumbs, search, theme & language switches
│   │   │   └── SideNavBar.jsx           # Sidebar icon groups with tooltips, active indicators & mobile drawer
│   │   ├── Modals/
│   │   │   ├── QuickSearchModal.jsx     # Instant search across athletes, bookings, and certificates (Ctrl+K)
│   │   │   └── HelpModal.jsx            # Platform guide, decree explanation & legal frameworks
│   │   └── Views/
│   │       ├── DashboardView.jsx            # Command center, KPIs, governorate/sport bars, age bands, audit log
│   │       ├── CitizenMobileView.jsx        # Interactive mobile frame (Home, 4-step Booking, Certs, Consents)
│   │       ├── ConsentGovernanceView.jsx    # Law 151/2020 access consent management & revocation
│   │       ├── CertificateRegistryView.jsx  # Searchable medical certificates registry with status filters
│   │       ├── CertificateDetailView.jsx    # Official printable A4 certificate with QR, e-sign & watermark
│   │       ├── PublicVerificationView.jsx   # Instant public certificate validation with valid/forged test cases
│   │       ├── ClubPortalView.jsx           # Club dashboard, player roster, bulk booking & consent tracking
│   │       ├── HospitalPortalView.jsx       # Daily hospital dashboard, slots, capacity & 2-stage approval
│   │       ├── PhysicianScreenView.jsx      # Doctor exam workflow: QR match, 1-tap exams, ECG upload, decision
│   │       ├── ReportsCenterView.jsx        # 6 presentation-format printable 16:9 slide decks with PDF export
│   │       ├── ClubRegistrationView.jsx     # Club onboarding form and accredited sports registry
│   │       ├── HospitalRegistrationView.jsx # Hospital onboarding form with capacity and level accreditation
│   │       └── PlatformSetupView.jsx        # Admin parameters: Medical code, fees, shifts, lists & security
```

---

## ✨ المميزات الرئيسية | Key Features

1. **دعم كامل للغتين (العربية والإنجليزية)**: تحويل فوري مع تبديل الاتجاه (`rtl` / `ltr`) وحفظ التفضيل محليًا.
2. **الوضع الليلي والنهاري (Dark / Light Mode)**: توافق بصري عالي الدقة لكافة الشاشات.
3. **طباعة رسمية A4**: الشهادة الطبية الرياضية مهيأة للطباعة المباشرة وحفظها كملف PDF مع علامة مائية وبصمة إلكترونية.
4. **عروض تقديمية 16:9 جاهزة للطباعة**: 6 تقارير تنفيذية بصيغة الشرائح مع الحفظ التلقائي كـ PDF.
5. **مطابقة قانون حماية البيانات 151/2020**: موافقات اطلاع محددة النطاق والمدة وقابلة للسحب الفوري.
6. **مبادرة «أشبالنا»**: مسار رعاية ومتابعة سرية للحالات القلبية وغير الطبيعية دون استبعاد الرياضيين.
