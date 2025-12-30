# STEP 3: Code Cleanup & MSW Introduction

## 1. Codebase Analysis
- [ ] Explore project structure
- [ ] Analyze service layer files
- [ ] Identify Redux slices and state structure
- [ ] Review current mock/real API setup
- [ ] Identify unused files and dead code

## 2. MSW Setup
- [ ] Install MSW dependency
- [ ] Create MSW folder structure (`src/mocks/`)
- [ ] Create MSW handlers:
  - [ ] auth.handlers.js
  - [ ] travel.handlers.js
  - [ ] document.handlers.js
  - [ ] dashboard.handlers.js
  - [ ] notification.handlers.js
  - [ ] passport.handlers.js
- [ ] Create browser.js setup
- [ ] Create index.js entry point
- [ ] Integrate MSW activation in main.jsx/index.js

## 3. Service Layer Cleanup
- [ ] Standardize authService
- [ ] Standardize travelService
- [ ] Standardize documentService
- [ ] Standardize dashboardService
- [ ] Standardize notificationService
- [ ] Standardize passportService
- [ ] Remove duplicate mock logic from services
- [ ] Ensure consistent error handling
- [ ] Remove dead code and commented blocks

## 4. Redux Cleanup
- [ ] Audit all slices for unused fields
- [ ] Remove JSX/icons/functions from Redux state
- [ ] Remove unused slices/reducers
- [ ] Ensure clean separation of data vs UI state

## 5. Folder & File Hygiene
- [ ] Identify and remove unused components
- [ ] Identify and remove dead utility files
- [ ] Merge duplicate helpers
- [ ] Standardize file naming conventions

## 6. Logging & Debug
- [ ] Create central logger utility
- [ ] Add clear prefixes ([MOCK], [MSW], [REAL API])
- [ ] Remove noisy console.logs

## 7. Validation & Safety
- [ ] Add defensive rendering (?., || [])
- [ ] Add graceful empty states
- [ ] Add minimal error boundaries

## 8. Testing & Validation
- [ ] Test mock mode (MSW ON)
- [ ] Test real API mode (MSW OFF)
- [ ] Verify status flow preserved
- [ ] Verify no breaking changes

## 9. Documentation
- [ ] Create CLEANUP_REPORT.md
- [ ] Create MSW_GUIDE.md
- [ ] Final confirmation checklist
