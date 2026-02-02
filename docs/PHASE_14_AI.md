# 🤖 Phase 14: AI Assistant (Option C)

## 1. Objective
Implement a rudimentary AI Assistant to help users query system data using natural language.

## 2. Architecture
-   **Model**: Google Gemini Pro (via Vercel AI SDK or Google SDK).
-   **Integration**: Repository Pattern (Tools call Services).

## 3. Features
1.  **Stock Query**: "Check stock of iPhone" -> `InventoryService.findByName()`.
2.  **Sales Summary**: "Revenue today?" -> `AnalyticsService.getAdminStats()`.
3.  **Navigation**: "Go to settings" -> Client-side redirect suggestion.

## 4. Implementation Plan

### Step 4.1: Backend `AiModule`
-   `AiController` (`POST /ai/chat`).
-   `AiService`:
    -   Initialize LLM.
    -   Define Tools (`checkStock`, `getRevenue`).

### Step 4.2: Frontend Chat Interface
-   `GlobalToolbar`: Add "Sparkles" icon.
-   `ChatDrawer`: Slide-out chat interface.
-   `useChat`: Vercel AI SDK hook.

## 5. Security
-   Ensure AI acts with the **User's Context** (RBAC).
-   If User is Employee, `getRevenue` (Global) should be denied or filtered.

**Approval?**
