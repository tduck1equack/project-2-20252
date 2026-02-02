# 🧠 Research: AI Integration (Smart Assistant)

## 1. Objective
Assess the feasibility of adding an AI-powered assistant to the ERP system to help users query stock, sales, and generate summaries using natural language.

## 2. Technology Stack Options

### Option A: Vercel AI SDK + OpenAI
-   **Stack**: `ai` (Vercel SDK), `openai`.
-   **Model**: GPT-4o-mini (Cost effective).
-   **Architecture**:
    -   Frontend: `useChat` hook.
    -   Backend: Next.js API Route (`/api/chat`) streaming response.
    -   Tools: `function_calling` to query Database (e.g., `getStock(productName)`).

### Option B: LangChain + Local LLM (Ollama)
-   **Stack**: LangChain.js, Ollama (running Llama 3).
-   **Pros**: Free (running on server). Privacy.
-   **Cons**: High server resource usage. Latency.

### Option C: Google Gemini API
-   **Stack**: Google GAI SDK.
-   **Pros**: Large context window, free tier available.
-   **Cons**: Rate limits on free tier.

## 3. Recommended Approach: Vercel AI SDK + OpenAI (or Gemini)
Vercel AI SDK provides the best Developer Experience (DX) for Next.js.

### Proposed Features
1.  **Stock Query**: "How many 'iPhone 15' do we have left?" -> Calls `inventoryService.findByName()`.
2.  **Sales Summary**: "How much did we sell yesterday?" -> Calls `reportsService.getSalesSummary()`.
3.  **Navigational Help**: "Take me to Order #123" -> Returns link.

## 4. Implementation Effort
-   **Complexity**: High (Prompt Engineering + Tool Definitions).
-   **Security**: Critical. AI must check logic (e.g., User can only see *their* data).
-   **Cost**: Usage-based (~$5/month for low volume).

## 5. Decision
For a University Project, this is a **High Impact / High Risk** feature.
-   **Recommendation**: Implement a basic "RAG" (Retrieval Augmented Generation) proof-of-concept for **Stock Queries** only.
