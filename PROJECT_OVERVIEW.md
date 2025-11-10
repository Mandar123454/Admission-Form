# Admission Form Project Overview

## 1. Summary
A static, client-side web application for collecting 11th-grade admission information. Users enter personal details and choose subjects; the form validates inputs, persists data temporarily to `localStorage`, then redirects to a thank‑you page that displays a submission summary.

## 2. Technologies & Dependencies
- **HTML5**: Semantic structure and form controls.
- **CSS3**: Theming, layout, gradient backgrounds, animations, accessibility focus styles, reduced motion support.
- **Google Fonts (Poppins)**: Typography.
- **Vanilla JavaScript (`app.js`)**: Validation, data persistence, redirection, dynamic summary rendering.
- **Browser Storage (localStorage)**: Temporary client-side storage of form submission.
- No build tools or external JS frameworks; deployable as pure static assets.

## 3. Architecture & File Structure
```
index.html          # Main admission form page
page2.html          # Thank-you page with submission summary
style.css           # Global styles (variables, layout, animations, accessibility)
app.js              # Validation, data handling, redirect logic, summary rendering
PROJECT_OVERVIEW.md # Technical documentation (this file)
README.md           # Quick start & usage guide
```

### Interactions
1. `index.html` loads `style.css` & `app.js` (deferred).
2. User completes form; `app.js` validates and enforces selections.
3. Data serialized to JSON in `localStorage` under key `admissionData`.
4. Browser redirects to `page2.html`.
5. `app.js` (on `page2.html`) reads `admissionData`, renders a summary, clears stored data.

## 4. Core Logic & Workflow
1. **Initialization**: DOMContentLoaded event sets up listeners.
2. **Live Constraints**: Elective checkbox changes enforce max two selections interactively.
3. **Submission**:
   - Prevent default form submit.
   - Run field-level validation (required, patterns, DOB range, elective counts).
   - Aggregate errors; display in an `aria-live` region if present.
   - On success: build payload → store → redirect.
4. **Thank-You Page**: Summary `<dl>` generated from stored payload; link provided to return to form.

## 5. Validation Strategy
- **Required Fields**: Name, gender, DOB, email, phone, address, elective1.
- **Phone**: Regex `^[0-9]{10}$`.
- **DOB**: Must parse to a date between 1980-01-01 and at least 10 years before current date (approximate age safety). *Adjust range as needed for real policy.*
- **Elective2 Group**: Exactly two checkboxes must be selected; interactive disabling prevents selecting more than two.
- **Error Feedback**: Aggregated list in `.form-errors` region with `aria-live="polite"`; invalid fields get `.input-error` style and `aria-invalid="true"`.

## 6. Accessibility Features
- Field grouping with `<fieldset>` & `<legend>`.
- `aria-live` region for dynamic error messaging.
- `:focus-visible` outlines for keyboard navigation.
- Hidden descriptive text for compulsory subjects using `.visually-hidden`.
- Reduced motion via `@media (prefers-reduced-motion: reduce)`.

## 7. Styling Approach
- Centralized **CSS Variables** for colors, spacing, radii, shadows.
- Removed duplicated animation definitions and consolidated `fadeIn`.
- Added component classes (`.form-container`, `.fieldset-group`, `.submission-summary`) for maintainability.
- Gradient-driven visual identity with accessible contrast adjustments recommended for future refinement.

## 8. Data Handling
- Client-only; no server communication.
- `localStorage` used transiently—data cleared after summary render to avoid stale entries.
- Future work: Replace with secure backend API + server-side validation.

## 9. Setup & Usage
### Local
Open `index.html` directly or serve with a lightweight static server:
```powershell
# From project root
npx serve .
```
Navigate to the served URL (default http://localhost:3000 or provided port). Submit the form; observe redirect + summary.

### Screenshots
- Form UI: `assets/screenshots/form.png`
- Thank-you + Summary: `assets/screenshots/thankyou.png`

### Deployment (GitHub Pages)
1. Commit all files to `main` branch.
2. In repo settings → Pages → Select branch `main` / root.
3. Access the published URL.

## 10. Improvement Suggestions (Future Roadmap)
- **Validation Enhancements**: Stricter DOB logic (age window 15–18), improved email pattern, phone country codes.
- **Internationalization**: Language switch + locale-specific date formatting.
- **Security**: Content Security Policy (remove any inline markup), sanitize output, server-side validation.
- **Backend Integration**: POST data to REST or GraphQL endpoint; handle async responses.
- **Progressive Enhancement**: Graceful fallback if JS disabled (server-rendered thank-you page).
- **Test Suite**: Add Playwright/Cypress tests for selection logic & error messaging.
- **Performance**: Minify CSS; use font-display swap; compress assets.
- **Design System**: Abstract form controls into reusable component classes.

## 11. Author & License
- **Author**: Mandar Kajbaje (placeholder).
- **License**: MIT (recommended). Add a `LICENSE` file for clarity.

## 12. Maintenance Notes
- Adjust DOB rule & curriculum subjects via constants in `app.js`.
- All validation logic centralized—extend with modular functions if complexity grows.

## 13. Known Limitations
- No persistence beyond single redirect (data cleared intentionally).
- Age boundaries generic; verify institutional requirements.
- Visual contrast on some gradients may require WCAG review.

## 14. Changelog (Recent)
- Added `app.js` with full validation + summary logic.
- Consolidated duplicate CSS animations & introduced variables.
- Refactored form markup: fieldsets, accessible error region.
- Added summary rendering and clearing mechanism.
- Moved thank-you page styling into shared `style.css`.

---
For questions or contributions, open an issue or propose enhancements in your version control platform.
