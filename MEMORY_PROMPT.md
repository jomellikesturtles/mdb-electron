# Repository Context Generation Prompt

Use this prompt to instruct an AI agent to analyze and "memorize" the repository context.

---

**Prompt:**

"Act as a Senior Software Architect. Your goal is to create a comprehensive 'Context Memory' for this project to ensure consistent understanding across future sessions.

Please perform the following actions:

1.  **Deep Analysis:**
    *   **Manifests:** Analyze `package.json`, `angular.json`, and `tsconfig.json` to determine the exact tech stack, versions, build targets, and scripts.
    *   **Structure:** Map the directory structure in `src/app`, identifying the core architecture (e.g., Feature Modules, Shared Modules, Core Services).
    *   **State Management:** Identify how state is handled (e.g., Akita, NgRx, Services).
    *   **Entry Points:** Locate the main entry points for both the Angular web app (`main.ts`) and the Electron process (`main.js`).

2.  **Synthesize Context:**
    *   **Project Identity:** What is this application? (MdbElectron - Movie Database & Streaming).
    *   **Key Patterns:** Document enforced patterns (e.g., 'Smart vs. Dumb' components, Singleton services, specific naming conventions).
    *   **Developer Guide:** Summarize the critical commands to start, test, and build the application for different environments (Web vs. Electron).

3.  **Persist Memory:**
    *   Update (or create) a file named `GEMINI.md` in the root directory.
    *   Structure it clearly with headers so it can be easily parsed.
    *   Include a section for 'Active Tasks' or 'Known Issues' if discovered in `todo.md` or comments.

**Goal:** The resulting `GEMINI.md` should allow any new agent to understand the entire project scope and architecture within seconds of reading it."
