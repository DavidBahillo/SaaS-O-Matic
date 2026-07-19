# Architecture Guidelines

## 1. Objective

Define the architectural rules that the application must follow to guarantee:

- Separation of responsibilities.
- Maintainable and scalable code.
- Ease of adding new business rules.
- Independence between layers.
- Consistency in code generation through AI.

---

# 2. Technology stack

## Backend

**The dependencies are as follows:**

- Node.js
- TypeScript
- Express
- SQLite as the initial database (sqlite3)
- @types/sqlite3
- CORS (cors)
- Environment variables with dotenv

**The development dependencies are as follows:**

- @types/cors
- @types/express
- @types/node
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser
- eslint
- eslint-config-prettier
- prettier
- ts-node
- tsx
- typescript

## Frontend

- Angular


## Tools

- Visual Studio Code
- Git
- npm
- Copilot (As an AI agent)
- Stich
- Google AI Studio

---

# 3. General architecture

The application will follow a layered architecture:

```
Frontend
   |
   |
API REST (Express / app.ts)
   |
   |
Routes (routes/*.ts)
   |
   |
Controllers (controllers/*.ts)
   |
   |
Services (services/*.ts)
   |
   |
Repositories (repositories/*.ts)
   |
   |
Database (database/sqlite.ts)
```

Each layer will have a specific responsibility


# 4. Backend structure

The structure is:

```
backend
│
├── data
│
├── package.json
├── package-lock.json
├── tsconfig.json
│
├── src
│   │
│   ├── app.ts
│   ├── server.ts
│   │
│   ├── controllers
│   │
│   ├── services
│   │
│   ├── repositories
│   │
│   ├── routes
│   │
│   ├── database
│   │
│   ├── utils
│   │
│   ├── models
│   ├── validation.ts
│   ├── pricing.ts
│   └── errors.ts
```

---

# 5. Responsibility of each layer

---

# Controllers

## Responsibility

Manage HTTP requests.

Must:

- Receive requests.
- Validate basic data.
- Call services.
- Return HTTP responses.

Must not:

- Contain business logic.
- Calculate prices.
- Execute SQL queries directly.

Example:

```
POST /simulations

Controller
      |
      |
SimulationService.create()
```

---

# Services

## Responsibility

Contain business logic.

Examples:

- Tiered price calculation.
- Tax application.
- Rule validation.
- Customer lifecycle management.

Example:

```
PricingService

input:
active_users = 75

output:
total_cost = 545 €
```

---

# Repositories

## Responsibility

Manage data access.

Must contain:

- SQL queries.
- Insertions.
- Updates.
- Deletions.

Must not contain:

- Business rules.
- Price calculations.

Example:

```
CustomerRepository

findById()
save()
update()
delete()
```

---

# Models

They represent the system entities.

## Customer

Fields:

```text
id
company_name
tax_id
contact_email
country
plan_id
created_at
```

---

## Simulation

Fields:

```text
id
customer_id
active_users
storage
api_calls
total_cost
created_at
```

---

# DTOs

DTOs define the API input and output.

Example:

## CreateCustomerDTO

```json
{
  "companyName": "Empresa Demo",
  "taxId": "B12345678",
  "contactEmail": "demo@email.com",
  "country": "ES",
  "planId": 1
}
```

---

## CreateSimulationDTO

```json
{
  "customerId": 1,
  "activeUsers": 75,
  "storage": 250,
  "apiCalls": 100000
}
```

---

# Validators

They centralize validations.

Examples:

```
validators
│
├── taxId.validator.ts
├── customer.validator.ts
└── simulation.validator.ts
```

Responsibilities:

- Validate DNI.
- Validate NIF.
- Validate CIF.
- Validate required fields.
- Validate data types.

---

# 6. Main business rules

---

# Tiered billing

The logic will be isolated in:

```
PricingService
```

It must never be in:

- In controllers.
- In repositories.
- In frontend.

---

Rules:

```
1-10 users:
10€/user

11-50 users:
8€/user

More than 50:
5€/usuario
```

Example:

```
75 users

10 x 10€
40 x 8€
25 x 5€

Total:
545€
```

---

# Taxes

Tax is calculated using:

```
customers.country
```

The simulation does not store country.

Flow:

```
Simulation
     |
customer_id
     |
Customer
     |
country
```

---

# 7. Deletion management

The API uses physical deletion for removing resources.

Endpoint:

```
DELETE /resource/{id}
```

Behavior:

- Permanently deletes.
- It cannot be recovered.

---

# 8. AI system prompt

When AI generates or modifies code in this project, the system prompt must include this instruction:

"Separation of responsibilities (Routes, Controllers, Services), simple dependency injection, strict typing in TypeScript".

Practical application:

- Separation of responsibilities:
   - Routes only register endpoints and delegate to controllers.
   - Controllers handle HTTP and delegate business logic to services.
   - Services concentrate business rules and orchestrate repositories.
- Simple dependency injection:
   - Services receive dependencies through constructor with default implementations.
   - This pattern allows testing without introducing a complex container.
- Strict typing in TypeScript:
   - strict must remain enabled.
   - External input is treated as unknown and validated before use.

## Consistency check with the current state

- Consistency in separation of responsibilities:
   - routes/* delegates to controllers/*.
   - controllers/* delegates to services/*.
   - repositories/* contains SQL access.
- Consistency in simple dependency injection:
   - CustomerService and SimulationService use constructor injection with default values.
- Consistency in strict typing:
   - tsconfig.json defines strict: true and additional strict rules.

Conclusion: the proposed guideline matches the backend implementation.

---

## Code

Must:

- Have descriptive names.
- Avoid duplication.
- Create small functions.
- Add comments where complex logic exists.

---

## Errors

All endpoints must return errors with a common format:

Example:

```json
{
  "error": "VALIDATION_ERROR",
   "message": "CIF is not valid"
}
```

---

# 9. Security

Initial guidelines:

- Validate all received data.
- Do not trust data sent by frontend.
- Use environment variables for configuration.
- Do not store passwords or sensitive data without protection.
- Limit access to endpoints when authentication exists.

---

# 10. Code conventions

## Files

Format:

```
camelCase
```

Example:

```
pricing.service.ts
customer.controller.ts
```

---

## Classes

PascalCase:

```
CustomerService
PricingService
```

---

## Variables

camelCase:

```
activeUsers
totalCost
customerId
```

---

# 11. Main architecture principle

The application must follow:

```
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Business logic must always be in services.

The database must only store and retrieve information.

The frontend must only consume the API and display information.