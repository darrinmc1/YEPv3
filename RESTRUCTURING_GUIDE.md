# Component Restructuring Guide

## Current Issues
- 20+ components in root directory
- Large, monolithic form components (600+ lines)
- No clear separation of concerns
- Backup files in source code

## New Structure

```
components/
├── forms/                    # All form components
│   ├── idea-validation-form.tsx
│   ├── explore-ideas-form.tsx
│   ├── waitlist-form.tsx
│   ├── order-form.tsx
│   └── form-steps/          # Shared form step components
│       ├── step-indicator.tsx
│       ├── form-navigation.tsx
│       └── form-field-group.tsx
│
├── layout/                   # Layout components
│   ├── site-header.tsx
│   ├── footer.tsx
│   └── appverse-footer.tsx
│
├── marketing/                # Marketing/landing page sections
│   ├── hero.tsx
│   ├── features.tsx
│   ├── pricing.tsx
│   ├── two-pathways.tsx
│   ├── ad-showcase.tsx
│   ├── idea-teaser.tsx
│   ├── logo-marquee.tsx
│   └── logo-section.tsx
│
├── effects/                  # Visual effects
│   ├── plasma.tsx
│   ├── Plasma.css
│   ├── lightning.tsx
│   ├── Lightning.css
│   ├── scroll-progress.tsx
│   └── lazy-video.tsx
│
├── modals/                   # Modal dialogs
│   ├── examples-dialog.tsx
│   ├── ideas-pricing-modal.tsx
│   ├── implementation-pricing-modal.tsx
│   └── pulse-check-modal.tsx
│
├── results/                  # Results display components
│   ├── post-capture-results.tsx
│   ├── idea-result-card.tsx     # Extract from explore-ideas-form
│   └── validation-results.tsx    # Extract from idea-validation-form
│
├── ui/                       # Keep existing shadcn components
│   └── ...
│
└── lib/                      # Shared utilities
    └── ...
```

## Priority Refactoring Tasks

### 1. Break Down Large Forms (PRIORITY 1)

**idea-validation-form.tsx** (600+ lines)
Split into:
- `forms/idea-validation-form.tsx` (main orchestrator, ~150 lines)
- `forms/validation-steps/step-1-idea-details.tsx`
- `forms/validation-steps/step-2-market-context.tsx`
- `forms/validation-steps/step-3-email-submit.tsx`
- `results/validation-results.tsx` (success state with upsells)
- `results/validation-loading.tsx` (loading state)
- `results/validation-error.tsx` (error states)

**explore-ideas-form.tsx** (700+ lines)
Split into:
- `forms/explore-ideas-form.tsx` (main orchestrator, ~150 lines)
- `forms/explore-steps/step-1-filters.tsx`
- `forms/explore-steps/step-2-email.tsx`
- `results/idea-result-card.tsx` (individual idea card)
- `results/ideas-list.tsx` (list of matched ideas)

### 2. Move Files (PRIORITY 2)

Execute these moves in order:

```bash
# Layout
move site-header.tsx → layout/
move footer.tsx → layout/
move appverse-footer.tsx → layout/

# Marketing
move hero.tsx → marketing/
move features.tsx → marketing/
move pricing.tsx → marketing/
move two-pathways.tsx → marketing/
move ad-showcase.tsx → marketing/
move idea-teaser.tsx → marketing/
move logo-marquee.tsx → marketing/
move logo-section.tsx → marketing/

# Effects
move plasma.tsx → effects/
move Plasma.css → effects/
move lightning.tsx → effects/
move Lightning.css → effects/
move scroll-progress.tsx → effects/
move lazy-video.tsx → effects/
move phone-video.tsx → effects/
move youtube-grid.tsx → effects/

# Modals
move examples-dialog.tsx → modals/
move ideas-pricing-modal.tsx → modals/
move implementation-pricing-modal.tsx → modals/
move pulse-check-modal.tsx → modals/

# Forms (no move yet, will refactor first)
# Keep in forms/ but mark for splitting

# Results
move post-capture-results.tsx → results/

# Other
move animated-stat.tsx → ui/
move exit-plans-logo.tsx → layout/
move theme-provider.tsx → lib/
```

### 3. Delete Unnecessary Files (PRIORITY 3)

```bash
# Remove backup files
delete hero.tsx.backup

# Remove empty files
delete app/utils.ts  # Empty file
```

### 4. Update Import Paths (PRIORITY 4)

After moving files, update all imports:

**Before:**
```typescript
import { Hero } from "@/components/hero"
import { Plasma } from "@/components/plasma"
```

**After:**
```typescript
import { Hero } from "@/components/marketing/hero"
import { Plasma } from "@/components/effects/plasma"
```

## Implementation Order

1. **Week 1: Setup & Move**
   - Create new folder structure ✅
   - Move files to new locations
   - Update imports
   - Test that app still runs

2. **Week 2: Break Down Forms**
   - Extract validation form steps
   - Extract explore form steps
   - Create shared form components

3. **Week 3: Extract Results Components**
   - Move success/error states to separate files
   - Create reusable result components

4. **Week 4: Cleanup & Polish**
   - Remove unused code
   - Add JSDoc comments
   - Document component props

## Benefits

✅ **Easier Navigation** - Find components by purpose
✅ **Reusability** - Extract shared form steps
✅ **Maintainability** - Smaller, focused files
✅ **Onboarding** - New devs understand structure quickly
✅ **Testing** - Test individual pieces
✅ **Performance** - Easier code splitting

## Next Steps

After restructuring, you'll be ready for AI integration with clean, maintainable code!
