# GitHub Copilot Project Instructions

This document provides the necessary workspace context and strict technical guidelines for GitHub Copilot to assist in code generation, refactoring, and code reviews for this project.

---

## 1. Workspace Context & Reference Files

Copilot should heavily rely on the following specification and configuration files located in the workspace to answer queries or generate code:

*   **Project Configurations (Backend):** Treat `backend/package.json` and `backend/tsconfig.json` as the primary project configuration references.
*   **UI Specs & Components:** `ai-workspace/DESIGN.md` (Contains the button design system and frontend directory structure).
*   **Architecture Rules:** `ai-workspace/architecture/guidelines.md` (Coding conventions and backend layers).
*   **API Contracts:** `ai-workspace/specs/api_contracts.md` (REST endpoints and data models).
*   **Business Rules:** `ai-workspace/specs/business_logic.md` (Pricing algorithms and ID validation).
*   **Database Schema:** `ai-workspace/specs/db_schema.md` (SQLite tables, indices, and relationships).

---

## 2. Core Architectural Principles

When generating code, Copilot must strictly adhere to these constraints:

*   **Layered Responsibility:** Business logic belongs **exclusively** in the **Service layer**. Never inject logic into Controllers, Repositories, or the Frontend.
*   **Backend Architecture:** Follow the unidirectional flow: `{Routes} → {Controllers} → {Services} → {Repositories}`.
*   **Strict Typing:** Always enforce strict TypeScript typing. Treat external inputs as `unknown` and validate them before processing.
*   **Dependency Injection:** Use explicit constructor-based dependency injection with default implementations to ensure easy unit testing.

---

## 3. Frontend & UI Design System (Angular)

### Component Selection Matrix
> **CRITICAL CONSTRAINT:** Never emit raw HTML `<button>` tags. Copilot must always use the dedicated custom components under `src/app/components/buttons/`.

| Component To Use | UX Role & Intent | Examples |
| :--- | :--- | :--- |
| `<app-button-primary>` | Main path actions. | `Save`, `Confirm` |
| `<app-button-secondary>` | Alternative or escape actions. | `Cancel`, `Back` |
| `<app-button-tertiary>` | Low-priority sub-actions. | `Add Client`, `Clear Filters` |
| `<app-button-danger>` | Critical or destructive actions. | `Delete Account` |

### Properties & Layout
*   **Allowed Attributes:** `label`, `icon` (Material Symbols), `fullWidth`, `reversed`, and `disabled`.
*   **Typography Rule:** Do *not* wrap button components in structural text blocks that alter their native font or layout integrity.

---

## 4. Business Logic Implementations

When writing or refactoring backend logic, implement these rules exactly as stated:

*   **Cumulative Tiered Pricing:** Costs are cumulative across tiers (`pricing_tiers`). If the database table is empty, fallback to these default seeded tiers:
    *   1–10 users: 10€ / user
    *   11–50 users: 8€ / user
    *   50+ users: 5€ / user
*   **Tax Application:** Apply local taxes based on the customer's country. Default to **21% VAT** if no specific rule is matched.
*   **Document Validation:** Spanish identity documents (DNI, NIF, CIF, NIE) must pass both format validation regex and control checksum validations.

---

## 5. Backend & Data Management (SQLite)

*   **Data Integrity:** Core relationship is $1:N$ between customers and simulations. `ON DELETE CASCADE` is mandatory on the customer side.
*   **API Standards:** Match the REST JSON contracts. All endpoints must return errors using the common standardized JSON error format.
*   **Deletion Policy:** Use physical deletion (`DELETE`). Do not implement soft deletes unless explicitly requested.

---

## 6. Copilot Behavior & Output Guidelines

When responding to chat or completing code, Copilot must follow these instructions:
1. Ensure strict separation of responsibilities (Routes, Controllers, Services).
2. Prioritize TypeScript strict typing and avoid the use of `any`.
3. If code generation involves a button, cross-reference `src/app/components/buttons/` and use the custom component matrix.
4. Keep explanations concise and focused directly on the code changes.