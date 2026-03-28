# Changelog

All notable changes to the Phú Vinh Tourism AI project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-02-07

### 🔐 User Authentication & Role-Based Admin System

This major release adds user authentication and a complete role-based permission system.

### Added

#### 👤 User Authentication
- **Login Page** (`/login`) - Email/password authentication with "Remember me"
- **Signup Page** (`/signup`) - User registration with password strength indicator
- **Profile Page** (`/profile`) - View/edit user info, logout
- **AuthProvider** - React Context for global auth state
- **AuthGuard** - Protected routes with auto-redirect to login

#### 👑 Role-Based Permissions
- **3 User Roles**: Super Admin (toàn quyền), Admin, User
- **Pre-seeded Super Admin**: `admin@phu-vinh.vn` / `admin123456`
- **Role Management**: Super Admin can promote/demote users
- **Admin Route Protection**: Non-admins blocked from `/admin/*`

#### 👥 User Management (Admin Dashboard)
- **New "Người dùng" Tab** - View all users with roles
- **Role Stats** - Total users, admins, super admins count
- **Promote/Demote Controls** - Super Admin only
- **Search & Filter** - Find users by name/email

### Changed

#### 🎨 Header Improvements
- User avatar dropdown with account menu
- "Tài khoản" link to profile page
- Login/Signup buttons for guests
- Mobile menu with auth links

#### 📁 New Files
```
src/lib/user-auth.ts                    # Auth service with roles
src/components/providers/auth-provider.tsx   # Auth context
src/components/auth/AuthGuard.tsx       # Protected routes
src/components/layout/MainLayoutWrapper.tsx  # Layout with auth
src/components/admin/UserManagement.tsx # User management UI
src/app/(auth)/login/page.tsx           # Login page
src/app/(auth)/signup/page.tsx          # Signup page
src/app/(main)/profile/page.tsx         # Profile page
src/components/ui/label.tsx             # Form label
src/components/ui/checkbox.tsx          # Checkbox component
```

### Technical
- **Build**: ✅ 21 static pages
- **Storage**: localStorage (demo), needs DB for production

---

## [1.2.0] - 2026-02-04

### 🌐 Language & Theme Toggle

This release adds multi-language support and theme switching capabilities.

### Added

#### 🌍 Language Toggle (Vietnamese / English)
- **LanguageProvider** (`src/components/providers/language-provider.tsx`)
  - Context-based language switching
  - 50+ translation keys for UI elements
  - Persistent language preference via localStorage
  - Globe icon toggle in header

#### 🌓 Theme Toggle (Light / Dark)
- **ThemeProvider** (`src/components/providers/theme-provider.tsx`)
  - Powered by next-themes
  - System theme detection
  - Animated sun/moon icon toggle
  - Smooth theme transition effects

#### 📱 Mobile Menu
- Hamburger menu for mobile devices
- Full navigation in mobile slide-down menu

### Changed

#### 🎨 CSS Improvements
- **Light Mode Theme** - Clean, ocean-inspired color palette
- **Dark Mode Readability** - Increased contrast for better text visibility
  - Muted foreground: `0.65 → 0.72` (brighter secondary text)
  - Improved border visibility
- **Smooth Theme Transitions** - 0.3s ease for all color changes
- **Conditional Backgrounds** - Starfield only shows in dark mode

#### 🔧 Header Redesign
- Language toggle button (VI/EN)
- Theme toggle with animated icon (sun/moon)
- Mobile hamburger menu
- Internationalized navigation labels

---

## [1.1.0] - 2026-02-03

### 🎯 Super Ultimate Upgrade - Phú Vinh Focus

This release implements the "Super Ultimate" upgrade focusing on hyper-local content for **Xã Phú Vinh** (not general Huế tourism).

### Added

#### 🎨 Premium UI Components
- **ImageCarousel Component** (`src/components/ui/image-carousel.tsx`)
  - Auto-play with pause on hover
  - Thumbnail navigation
  - Fullscreen mode with keyboard navigation (←/→/Esc)
  - Graceful fallback for missing images
  - Responsive design for mobile

#### 📍 Enhanced Pages
- **Destinations Page** - Two-column modal layout
  - Left: Image gallery with carousel
  - Right: Detailed information, tips, costs
  - "Ask AI" button for contextual questions
  - Embedded Google Maps
  - Smooth Framer Motion animations

- **Crafts Page** - Production process display
  - Step-by-step production process
  - Product pricing grid
  - Shopping tips section
  - AI integration for product questions

### Changed

#### 📊 Content Enhancement
- **destinations.md** - Complete rewrite with hyper-local Phú Vinh content
  - Biển Vinh Thanh: Detailed sunrise times, seafood prices, photography tips
  - Biển Phú Diên: Fishing village experience, boat rides, fish market timing
  - Làng An Bằng: Cultural significance, international media coverage, etiquette
  - Added distance matrix between locations
  - Added 3 suggested itineraries (half-day morning, afternoon, full day)

- **crafts.md** - Enhanced with production details
  - Nước ớt Vinh Xuân: 6-step production process, product pricing
  - Mắm Phú Diên: Fermentation timeline, different types of fish sauce
  - Cultural and economic value section

- **food.md** - New hyper-local seafood focus
  - Fresh seafood by season with prices
  - Local dishes and how to enjoy them
  - Restaurant recommendations at fishing villages
  - Combo meal suggestions with prices
  - Tips for eating at local establishments

#### 📸 Image System
- **image-guide-phu-vinh.md** - Comprehensive image sourcing guide
  - Detailed requirements for 55 images
  - Search keywords for each image
  - Recommended sources (Google Maps, Facebook, local news)
  - Technical specifications (format, size, compression)

### Technical

- **Build**: ✅ Successful with 0 TypeScript errors
- **Pages**: 9 static pages, 1 dynamic API route
- **Framework**: Next.js 16.1.6 with Turbopack

### Dependencies

No new dependencies added. Existing stack:
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Shadcn/UI
- Framer Motion
- Google Gemini AI

---

## [1.0.0] - Initial Release

### Added
- Basic tourism website structure
- AI chatbot with Gemini integration
- RAG system with TF-IDF
- Basic destination, craft, and food pages
- Google Maps integration
- Mobile-responsive design

---

## 🔜 Roadmap

### Planned for v1.2.0
- [ ] Trip Planner UI enhancement
- [ ] Story Mode with narrative AI
- [ ] Voice-ready text formatting
- [ ] Advanced route suggestions

### Planned for v1.3.0
- [ ] Offline mode support
- [ ] PWA capabilities
- [ ] Multi-language support (EN/JP/KR)
