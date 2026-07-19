## Matrix & Rules for Buttons Component API

Always use the dedicated individual button components instead of creating raw HTML buttons. Select the appropriate component based on the UX context and follow the technical property mapping below.

## UI Directory Structure & File Architecture

To maintain project consistency, all shared and reusable visual elements must be strictly organized under the `src/app/components/` directory. 
Both AI models and developers must adhere to the following folder structure when creating, modifying, or importing interface components:


src/app/components/
├── buttons/
│   ├── button-primary.ts       # Primary action button 
│   ├── button-secondary.ts     # Alternative/escape action button 
│   ├── button-tertiary.ts      # Low-priority or contextual button 
│   └── button-danger.ts        # Destructive action button 
└── layout/
    ├── top-menu.ts             # Fixed top navigation bar for desktop views
    ├── side-bar.ts             # Collapsible sidebar for main navigation
    └── mobile-bottom-menu.ts   # Bottom navigation bar optimized for mobile devices
   

### 1. Button Selection Matrix

| Component | UX Role & Intent | Common Use Cases |
| :--- | :--- | :--- |
| `<app-button-primary>` | Main actions. Represents the ideal path of the view. | `Nuevo presupuesto`, `Guardar`, `Confirmar` |
| `<app-button-secondary>` | Alternative actions or escape routes accompanying primary. | `Cancelar`, `Volver`, `Actualizar Credenciales` |
| `<app-button-tertiary>` | Sub-actions, links, or repetitive low-priority grid tools. | `Añadir cliente`, `Ver más`, `Limpiar filtros` |
| `<app-button-danger>` | Critical, destructive, or irreversible actions. | `Eliminar Cuenta`, `Borrar de la base de datos` |

---

### 2. Properties & Layout Rules (All Components)

Every button component shares a standard interface with structural modifiers:

- **`label` (`string`):** Text content inside the button.
- **`icon` (`string`):** Material Symbols icon name. If passed as an empty string (`icon=""`), the template DOM element container is completely removed via `@if` to drop Tailwind's `gap-2` and prevent center misalignment.
- **`fullWidth` (`boolean`):** When `true`, applies `w-full` to adapt to the container width.
- **`reversed` (`boolean`):** When `true`, applies `flex-row-reverse` to flip the visual slot position of the icon and text (available on Primary, Secondary, and Tertiary).
- **`disabled` (`boolean`):** Available on Primary and Secondary. When `true`, the native `button` is disabled, click events are not emitted, and disabled visual state is applied (`opacity-50`, `cursor-not-allowed`, `pointer-events-none`).

---

### 3. Component Specifications & Design System Compliance

#### `<app-button-primary>`
- **Visuals:** Solid fill using the main brand accent token.
- **Obsidian Dark Rule override:** It includes a subtle structural glow to give depth to the main action. No other element should use shadows.
- **Base Style Framework:** `bg-primary text-on-primary hover:bg-primary-fixed-dim shadow-[0_0_20px_rgba(167,139,250,0.15)]`

#### `<app-button-secondary>`
- **Visuals:** Flat transparent surface that dynamically reacts to borders and focus state.
- **Modifiers:**
  - `borderColorClass="true"`: Draws a sharp boundary line using `border border-on-secondary-fixed-variant`.
  - `buttonColorClass="true"`: Overrides base text to target primary color tokens (`text-primary hover:text-primary-fixed-dim`).
- **Base Style Framework:** `bg-transparent text-on-surface hover:text-primary hover:border-primary`

#### `<app-button-tertiary>`
- **Visuals:** Frameless text button blending natively into surface layouts until hovered.
- **Modifiers:**
  - `buttonColorClass="true"`: Forces the text colors to stick to the active primary brand token scheme.
- **Base Style Framework:** `text-on-surface-variant hover:bg-surface-container hover:text-on-surface`

#### `<app-button-danger>`
- **Visuals:** Framed outline border utilizing system error tokens. Explicitly alerts the user of data loss risks.
- **Base Style Framework:** `border border-error bg-transparent text-error hover:bg-error/10`

---

### Critical LLM Code Generation Constraints
1. **Typography Integrity:** Buttons handle typography hierarchy natively via `labelClass` defaults (`text-sm font-bold` or `font-medium`). Do not wrap button components into structural text blocks or add parent utility rules that alter line-heights or alignments.

---

### 4. Quote Flow UX Guardrails (Presupuesto)

- In `app-presupuesto`, both submit actions must remain disabled until a customer is selected.
- Required bindings in quote action buttons:
  - `<app-button-secondary [disabled]="!selectedClient()" ... />`
  - `<app-button-primary [disabled]="!selectedClient()" ... />`
- Rationale: prevents accidental quote persistence without a selected customer and aligns UI affordance with validation rules.