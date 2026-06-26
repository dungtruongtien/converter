# Planning & Analysis Skill

Use this skill when asked to plan a new tool, feature, or refactor in the ToolFree project.

## Steps

### 1. Read PROJECT.md first
Always read `PROJECT.md` before planning. It contains the authoritative reference for:
- Color theme per category
- Layout structure templates
- Coding conventions
- Existing tool routes (to avoid duplicates)

### 2. Classify the tool
Determine the category:
- **Social Media Downloader** → purple gradient, needs API route + captcha + session store
- **PDF/Document Tool** → blue, needs server-side processing + file storage
- **Developer Utility** → green gradient, runs entirely client-side (no API route)

### 3. Define the tool spec
Answer these before writing code:
- **URL slug**: `/tool-name` (kebab-case, descriptive, SEO-rich)
- **Page title**: `"Tool Name — Free Online Tool | ToolFree"`
- **Meta description**: 150-160 chars, include primary keyword
- **Input type**: textarea / file upload / form fields
- **Output type**: text / file download / formatted display
- **Client-only or needs API?**: Developer utilities = client-only. File processing = API route.
- **Options panel needed?**: List any configuration options
- **JSON-LD schemas**: `WebApplication` + `HowTo` + `FAQPage` + `BreadcrumbList`

### 4. Plan the component structure
```
app/[slug]/page.tsx          ← Server component, metadata, JSON-LD, imports client
components/[Tool]Client.tsx  ← "use client", all interactivity
```
Developer utilities: client component contains ALL logic inline — no lib file needed.

### 5. List SEO requirements
- Canonical URL
- 5–10 target keywords
- FAQ: 4–6 Q&A pairs relevant to the tool
- HowTo steps: exactly 3 steps
- Related tools: which 3 to show (prefer cross-category first)

### 6. List all files to create/update
- New: `app/[slug]/page.tsx`, `components/[Tool]Client.tsx`
- Update: `app/page.tsx`, `components/navbar.tsx`, `app/sitemap.ts`, `components/related-tools.tsx`

### 7. Output the plan as a checklist
```markdown
## Plan: [Tool Name]

**Route:** `/tool-name`
**Category:** Developer Utility (green)
**Client-only:** Yes

### Files to create
- [ ] `app/tool-name/page.tsx`
- [ ] `components/ToolNameClient.tsx`

### Files to update
- [ ] `app/page.tsx` — add to Dev Utilities grid
- [ ] `components/navbar.tsx` — add to Dev Tools dropdown
- [ ] `app/sitemap.ts` — add route
- [ ] `components/related-tools.tsx` — add to registry

### Component spec
- Input: textarea (placeholder: ...)
- Output: styled result panel
- Options: none
- Copy button: yes

### SEO
- Title: "..."
- Description: "..."
- Keywords: [...]
- FAQ: 4 items (listed)
```
