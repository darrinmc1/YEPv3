# Admin Dashboard Architecture

## Visual Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     page-refactored.tsx                         │
│                    (Main Orchestrator)                          │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ • Authentication check                                     │ │
│  │ • Initialize hooks                                         │ │
│  │ • Route between pages                                      │ │
│  │ • Handle global events                                     │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
        ┌──────────────┬──────────────┬──────────────┐
        │   Custom     │   Shared     │    Page      │
        │   Hooks      │  Components  │  Components  │
        └──────────────┴──────────────┴──────────────┘
                │             │             │
        ┌───────┼───────┐     │     ┌───────┼────────┐
        │       │       │     │     │       │        │
        ▼       ▼       ▼     ▼     ▼       ▼        ▼
    ┌──────┐ ┌──────┐     ┌─────┐     ┌───────┐  ┌────────┐
    │useC- │ │useA- │     │Admin│     │Home   │  │Content │
    │ontent│ │ctivi-│     │Lay- │     │Page   │  │Page    │
    │Stora-│ │tyTra-│     │out  │     │       │  │        │
    │ge   │ │cker  │     │     │     └───────┘  └────────┘
    └──────┘ └──────┘     └─────┘
        │        │            │
        ▼        ▼            ▼
    ┌───────────────────────────┐
    │       Utilities           │
    ├───────────────────────────┤
    │ • types/index.ts          │
    │ • lib/constants.ts        │
    │ • lib/utils.ts            │
    └───────────────────────────┘
```

## Data Flow

### Loading Content

```
User visits /admin
       │
       ▼
page-refactored.tsx
       │
       ├─► Check authentication (cookie)
       │
       ├─► useContentStorage()
       │        │
       │        ├─► Read from localStorage
       │        │
       │        └─► Return { content, setContent, saveContent, ... }
       │
       └─► useActivityTracker()
                │
                ├─► Read from localStorage
                │
                └─► Return { activityItems, addActivity, ... }
```

### Saving Changes

```
User edits content
       │
       ▼
ContentPage
       │
       └─► onContentChange(section, field, value)
                │
                ▼
       page-refactored.tsx
                │
                └─► setContent(updatedContent)
                         │
                         ▼
                useContentStorage
                         │
                         ├─► Update state
                         │
                         └─► Set hasChanges = true

User clicks "Save"
       │
       ▼
ContentPage → onSave()
       │
       ▼
page-refactored.tsx → handleSave()
       │
       ├─► saveContent()
       │        │
       │        └─► localStorage.setItem('content', ...)
       │
       └─► addActivity(section)
                │
                └─► localStorage.setItem('activity', ...)
```

## Component Hierarchy

```
AdminDashboardRefactored
│
└─► AdminLayout
    │
    ├─► Sidebar
    │   ├─► Logo
    │   ├─► Navigation Menu
    │   │   ├─► Home
    │   │   ├─► Content
    │   │   ├─► Pricing
    │   │   ├─► Orders
    │   │   ├─► Analytics
    │   │   ├─► Settings
    │   │   └─► Help
    │   └─► Logout Button
    │
    ├─► Header
    │   ├─► Page Title
    │   ├─► Search Bar
    │   ├─► Notifications
    │   └─► User Avatar
    │
    └─► Main Content (children)
        │
        └─► [Page Components based on route]
            │
            ├─► HomePage
            │   ├─► Status Banner
            │   ├─► Stats Cards
            │   └─► Activity Feed
            │
            ├─► ContentPage
            │   ├─► Tabs
            │   │   ├─► Hero
            │   │   ├─► Features
            │   │   └─► Footer
            │   ├─► Form Inputs
            │   └─► Save/Preview Buttons
            │
            ├─► AnalyticsPage
            │   ├─► Metrics Cards
            │   ├─► Traffic Chart
            │   └─► Top Pages
            │
            └─► HelpPage
                ├─► Quick Start
                ├─► Contact Support
                └─► FAQ
```

## State Management

### Global State (via Hooks)

```typescript
// In page-refactored.tsx
const { content, setContent, hasChanges, saveContent } = useContentStorage()
const { activityItems, addActivity } = useActivityTracker()

// Passed down as props
<HomePage activityItems={activityItems} />
<ContentPage content={content} onContentChange={handleChange} />
```

### Local State (Component-Level)

```typescript
// In individual components
const [isSaving, setIsSaving] = useState(false)
const [saveMessage, setSaveMessage] = useState("")
const [selectedTab, setSelectedTab] = useState("hero")
```

## Hook Architecture

### useContentStorage

```
┌─────────────────────────────────┐
│     useContentStorage()         │
├─────────────────────────────────┤
│ State:                          │
│  • content                      │
│  • originalContent              │
│  • hasChanges                   │
├─────────────────────────────────┤
│ Effects:                        │
│  • Load from localStorage       │
│  • Track changes                │
├─────────────────────────────────┤
│ Methods:                        │
│  • saveContent()                │
│  • resetContent()               │
├─────────────────────────────────┤
│ Returns:                        │
│  { content, setContent,         │
│    hasChanges, saveContent,     │
│    resetContent }               │
└─────────────────────────────────┘
```

### useActivityTracker

```
┌─────────────────────────────────┐
│    useActivityTracker()         │
├─────────────────────────────────┤
│ State:                          │
│  • activityItems                │
├─────────────────────────────────┤
│ Effects:                        │
│  • Load from localStorage       │
├─────────────────────────────────┤
│ Methods:                        │
│  • addActivity(section)         │
│  • resetActivity()              │
├─────────────────────────────────┤
│ Returns:                        │
│  { activityItems,               │
│    setActivityItems,            │
│    addActivity,                 │
│    resetActivity }              │
└─────────────────────────────────┘
```

## Type System

```
types/index.ts
├─► ContentData
│   ├─► hero: { title, subtitle, buttonText }
│   ├─► features: { title, subtitle }
│   ├─► footer: { tagline, copyright }
│   ├─► about: { ... }
│   ├─► pricing: { startup, pro, premium }
│   ├─► orderForm: { ... }
│   └─► settings: { adminEmail, adminPassword }
│
├─► PricingTier
│   ├─► price_usd: string
│   ├─► price_inr: string
│   ├─► features: string[]
│   └─► videos: string[]
│
├─► ActivityItem
│   ├─► id: string
│   ├─► name: string
│   ├─► status: string
│   ├─► change: string
│   ├─► icon: string
│   ├─► time: string
│   └─► timestamp: number
│
└─► AnalyticsMetric
    ├─► metric: string
    ├─► value: string
    ├─► change: string
    └─► trend: "up" | "down"
```

## Routing Logic

```typescript
function renderPage() {
  switch (selectedPage) {
    case "home":
      return <HomePage {...props} />

    case "content":
      return <ContentPage {...props} />

    case "analytics":
      return <AnalyticsPage {...props} />

    case "help":
      return <HelpPage />

    // TODO: Add these
    case "pricing":
      return <PricingPage {...props} />

    case "orders":
      return <OrdersPage {...props} />

    case "settings":
      return <SettingsPage {...props} />

    default:
      return <PlaceholderPage page={selectedPage} />
  }
}
```

## Comparison: Old vs New

### Old Architecture (Monolithic)

```
┌──────────────────────────────────┐
│                                  │
│          page.tsx                │
│         (1,812 lines)            │
│                                  │
│  ┌────────────────────────────┐  │
│  │ Everything mixed together: │  │
│  │ • Types                    │  │
│  │ • Constants                │  │
│  │ • State management         │  │
│  │ • Business logic           │  │
│  │ • Event handlers           │  │
│  │ • UI components            │  │
│  │ • Utility functions        │  │
│  └────────────────────────────┘  │
│                                  │
└──────────────────────────────────┘

Problems:
❌ Hard to navigate
❌ Impossible to test
❌ Difficult to maintain
❌ Code duplication
❌ No reusability
```

### New Architecture (Modular)

```
┌─────────────────────────────────────────────────┐
│            Layered Architecture                 │
├─────────────────────────────────────────────────┤
│  Layer 1: Types & Constants                    │
│  ├─ types/index.ts                             │
│  └─ lib/constants.ts                           │
├─────────────────────────────────────────────────┤
│  Layer 2: Utilities                            │
│  └─ lib/utils.ts                               │
├─────────────────────────────────────────────────┤
│  Layer 3: Business Logic (Hooks)               │
│  ├─ hooks/useContentStorage.ts                 │
│  └─ hooks/useActivityTracker.ts                │
├─────────────────────────────────────────────────┤
│  Layer 4: UI Components                        │
│  ├─ components/AdminLayout.tsx                 │
│  ├─ components/HomePage.tsx                    │
│  ├─ components/ContentPage.tsx                 │
│  ├─ components/AnalyticsPage.tsx               │
│  └─ components/HelpPage.tsx                    │
├─────────────────────────────────────────────────┤
│  Layer 5: Orchestration                        │
│  └─ page-refactored.tsx                        │
└─────────────────────────────────────────────────┘

Benefits:
✅ Clear separation of concerns
✅ Easy to navigate
✅ Testable modules
✅ Maintainable
✅ Reusable components
✅ Type-safe
```

## Testing Strategy

```
Unit Tests
├─► lib/utils.test.ts
│   ├─ formatTimeAgo()
│   └─ extractYoutubeId()
│
├─► hooks/useContentStorage.test.ts
│   ├─ Loads from localStorage
│   ├─ Tracks changes correctly
│   ├─ Saves content
│   └─ Resets content
│
└─► hooks/useActivityTracker.test.ts
    ├─ Loads from localStorage
    ├─ Adds activity
    └─ Resets activity

Component Tests
├─► components/HomePage.test.tsx
├─► components/ContentPage.test.tsx
├─► components/AnalyticsPage.test.tsx
└─► components/HelpPage.test.tsx

Integration Tests
└─► page-refactored.test.tsx
    ├─ Navigation works
    ├─ Save flow works
    └─ Activity tracking works
```

## Performance Optimizations

### Code Splitting

```typescript
// Lazy load heavy components
const PricingPage = lazy(() => import('./components/PricingPage'))
const OrdersPage = lazy(() => import('./components/OrdersPage'))

// In renderPage()
<Suspense fallback={<Loading />}>
  <PricingPage {...props} />
</Suspense>
```

### Memoization

```typescript
// In components
export const HomePage = memo(function HomePage({ ... }) {
  const memoizedStats = useMemo(() => calculateStats(), [deps])
  const handleClick = useCallback(() => {...}, [deps])
  return ...
})
```

## Future Improvements

1. **API Integration**
   - Replace localStorage with API calls
   - Add server-side state management
   - Implement optimistic updates

2. **Real Authentication**
   - Use NextAuth for admin routes
   - Secure cookie handling
   - Role-based permissions

3. **Advanced Features**
   - Real-time collaboration
   - Version control (content history)
   - Draft/publish workflow
   - Media library

4. **Developer Experience**
   - Add Storybook for components
   - Set up Playwright for E2E tests
   - Add pre-commit hooks
   - CI/CD pipelines

---

This architecture provides a solid foundation for scaling the admin dashboard while maintaining code quality and developer productivity.
