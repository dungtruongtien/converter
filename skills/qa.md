# QA Skill — Tool Testing

Use this skill to spawn a QA agent for a specific tool. One agent per tool.

## How to spawn a QA agent

For each tool, spawn an Agent with this prompt template (fill in the placeholders):

```
You are a QA engineer testing the [TOOL NAME] tool in the ToolFree Next.js project.
The tool is implemented at:
  - Page: /Users/tiendung/Desktop/Personal/Projects/Converter/converter/app/[SLUG]/page.tsx
  - Client component: /Users/tiendung/Desktop/Personal/Projects/Converter/converter/components/[CLIENT_COMPONENT].tsx

Your job:
1. Read both files completely.
2. Verify the logic is correct for these test cases: [LIST CASES]
3. Check for edge cases: empty input, very long input, special characters, unicode.
4. Verify the copy-to-clipboard button exists.
5. Verify RelatedTools is imported and rendered.
6. Verify metadata (title, description, canonical, openGraph) is complete.
7. Verify JSON-LD includes WebApplication, HowTo, FAQPage, BreadcrumbList.
8. Run `npx tsc --noEmit` in the project directory and confirm zero errors.
9. Report: PASS or FAIL for each check, and list any bugs found with the exact file + line number.
```

---

## Tool-specific test cases

### Word Counter (`/word-counter`)
- "hello world" → 2 words, 11 chars, 1 sentence, 2 unique words
- "" (empty) → 0 words, 0 chars, 0 sentences
- "  spaces   " → 0 words (trimmed)
- Long text (1000+ words) → correct count

### Character Counter (`/character-counter`)
- "hello" → 5 chars with spaces, 5 without, 5 letters, 0 digits
- "hello 123" → 9 with, 8 without, 5 letters, 3 digits
- "" → all zeros

### Case Converter (`/case-converter`)
- "hello world" → UPPER: "HELLO WORLD", lower: "hello world", Title: "Hello World", camelCase: "helloWorld", PascalCase: "HelloWorld", snake_case: "hello_world", kebab-case: "hello-world"
- Already uppercased input → convert correctly
- Mixed case → convert correctly

### Base64 Encode/Decode (`/base64`)
- Encode "hello" → "aGVsbG8="
- Decode "aGVsbG8=" → "hello"
- Invalid base64 decode → show error message
- Unicode: "héllo" encodes and decodes round-trip correctly

### URL Encode/Decode (`/url-encode`)
- Encode "hello world & more" → "hello%20world%20%26%20more"
- Decode "hello%20world" → "hello world"
- Invalid percent sequence → show error or pass through
- Full URL encodes correctly

### Cron Expression Generator (`/cron-generator`)
- Every minute → "* * * * *"
- Every hour → "0 * * * *"
- Every day at midnight → "0 0 * * *"
- Every Monday → "0 0 * * 1"
- Custom: 9:30 AM on weekdays → "30 9 * * 1-5"
- Human-readable description shown for each expression

### Timestamp Converter (`/timestamp-converter`)
- Unix 0 → "1970-01-01 00:00:00 UTC"
- Current timestamp → shows current date/time
- ISO string → converts to Unix timestamp
- Invalid input → error message shown

### Unit Converter (`/unit-converter`)
- 1 km → 0.621371 miles
- 1 kg → 2.20462 lbs
- 100°C → 212°F
- 0°C → 32°F
- -40°C → -40°F (the crossover point)
- 1 inch → 2.54 cm
- Shows result to 4-6 significant figures

---

## QA report format

Each agent should return:

```markdown
## QA Report: [Tool Name]

**Status:** PASS | FAIL | PARTIAL

### Checks
| Check | Result | Notes |
|---|---|---|
| Logic correct | ✅ / ❌ | |
| Edge cases handled | ✅ / ❌ | |
| Copy button exists | ✅ / ❌ | |
| RelatedTools rendered | ✅ / ❌ | |
| Metadata complete | ✅ / ❌ | |
| JSON-LD complete | ✅ / ❌ | |
| TypeScript clean | ✅ / ❌ | |

### Bugs Found
- [file:line] Description of bug
```
