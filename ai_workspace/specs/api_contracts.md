# REST API - Users, Customers, Simulations, Impuestos, and Pricing Tiers

## Data model

### customers table

```sql
CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_name TEXT NOT NULL,
  tax_id TEXT,
  contact_email TEXT NOT NULL,
  country TEXT NOT NULL,
  plan_id TEXT CHECK (plan_id IN ('Plan Starter', 'Plan Pro', 'Plan Enterprise')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### users table

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  contrasena TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'usuario',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### simulations table

```sql
CREATE TABLE simulations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  budget_name TEXT NOT NULL,
  active_users INTEGER NOT NULL,
  storage REAL NOT NULL,
  api_calls INTEGER NOT NULL,
  total_cost REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id)
    REFERENCES customers(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
```

### impuestos table

```sql
CREATE TABLE impuestos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  country_name TEXT NOT NULL UNIQUE,
  tax_name TEXT NOT NULL,
  percentage REAL NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### pricing_tiers table

```sql
CREATE TABLE pricing_tiers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level INTEGER NOT NULL UNIQUE CHECK (level > 0),
  user_limit INTEGER CHECK (user_limit IS NULL OR user_limit > 0),
  price_per_user REAL NOT NULL CHECK (price_per_user >= 0),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Users API

### POST /users/login

Request:

```json
{
  "email": "david@example.com",
  "contrasena": "supersecreta123"
}
```

Response 200:

```json
{
  "id": 1,
  "nombre": "David",
  "apellido": "Bahillo",
  "email": "david@example.com",
  "rol": "admin",
  "createdAt": "2026-07-17T13:30:00"
}
```

Errors:

- `401 UNAUTHORIZED` if the credentials are not valid.

### POST /users

Required header:

```text
x-user-id: <authenticated user id>
```

Only allowed for users with `admin` role.

Request:

```json
{
  "nombre": "David",
  "apellido": "Bahillo",
  "email": "david@example.com",
  "contrasena": "supersecreta123",
  "rol": "usuario"
}
```

Response 201:

```json
{
  "id": 1,
  "nombre": "David",
  "apellido": "Bahillo",
  "email": "david@example.com",
  "rol": "usuario",
  "createdAt": "2026-07-17T13:30:00"
}
```

Errors:

- `401 UNAUTHORIZED` if the `x-user-id` header does not correspond to any user.
- `403 FORBIDDEN` if the authenticated user does not have `admin` role.
- `409 CONFLICT` if a user with that email already exists.

### GET /users

Lists all users.

Response 200:

```json
[
  {
    "id": 1,
    "nombre": "David",
    "apellido": "Bahillo",
    "email": "david@example.com",
    "rol": "admin",
    "createdAt": "2026-07-17T13:30:00"
  }
]
```

### GET /users/{id}

Gets a user by identifier.

Response 200:

```json
{
  "id": 1,
  "nombre": "David",
  "apellido": "Bahillo",
  "email": "david@example.com",
  "rol": "admin",
  "createdAt": "2026-07-17T13:30:00"
}
```

Errors:

- `404 NOT_FOUND` if the user does not exist.

### PUT /users/{id}

Updates a user. All fields are optional; current values are kept if omitted. If `contrasena` is included, it must be at least 8 characters long.

Request:

```json
{
  "nombre": "David",
  "apellido": "Bahillo",
  "email": "nuevo@example.com",
  "contrasena": "nuevacontrasena123",
  "rol": "admin"
}
```

Response 200:

```json
{
  "id": 1,
  "nombre": "David",
  "apellido": "Bahillo",
  "email": "nuevo@example.com",
  "rol": "admin",
  "createdAt": "2026-07-17T13:30:00"
}
```

Errors:

- `404 NOT_FOUND` if the user does not exist.
- `409 CONFLICT` if the new email is already in use by another user.

### DELETE /users/{id}

Permanently deletes a user.

Response 204: no body.

Errors:

- `404 NOT_FOUND` if the user does not exist.

## Customers API

### POST /customers

Request:

```json
{
  "companyName": "Empresa Demo S.L.",
  "taxId": "B12345678",
  "contactEmail": "contacto@empresa.com",
  "country": "ES",
  "planId": "Plan Starter"
}
```

Response 201:

```json
{
  "id": 1,
  "companyName": "Empresa Demo S.L.",
  "taxId": "B12345678",
  "contactEmail": "contacto@empresa.com",
  "country": "ES",
  "planId": "Plan Starter",
  "createdAt": "2026-07-15T10:30:00"
}
```

### GET /customers

Lists all customers.

### GET /customers/{id}

Gets a customer by identifier.

### GET /customers/{id}/full

Returns customer and associated simulations.

### PUT /customers/{id}

Updates a customer.

### DELETE /customers/{id}

Permanently deletes a customer.

## Simulations API

### POST /simulations

Request:

```json
{
  "customerId": 1,
  "activeUsers": 75,
  "storage": 250.5,
  "apiCalls": 100000,
  "currency": "EUR"
}
```

### GET /simulations

Lists simulations. Supports optional filtering by customerId.

Example:

```text
GET /simulations?customerId=1
```

### GET /simulations/{id}

Gets a simulation by identifier.

### PUT /simulations/{id}

Updates a simulation and recalculates total cost.

### DELETE /simulations/{id}

Permanently deletes a simulation.

## Impuestos API

### POST /impuestos

Creates a tax.

### GET /impuestos

Lists taxes.

### GET /impuestos/{id}

Gets a tax by id.

### PUT /impuestos/{id}

Updates tax.

### DELETE /impuestos/{id}

Deletes tax.

## Pricing Tiers API

### POST /pricing-tiers

Creates a tier.

### GET /pricing-tiers

Lists tiers.

### GET /pricing-tiers/{id}

Gets tier by id.

### PUT /pricing-tiers/{id}

Updates tier.

### DELETE /pricing-tiers/{id}

Deletes tier.

## Countries API

### GET /countries

Returns the list of valid country codes (ISO 3166-1 alpha-2) accepted by the application.

Response 200:

```json
["AD", "AE", "AF", "...", "ES", "...", "ZW"]
```

## Endpoint summary

| Method | Endpoint                | Action                           |
| ------ | ----------------------- | -------------------------------- |
| GET    | /countries              | List valid countries             |
| POST   | /users/login            | Log in user                      |
| POST   | /users                  | Create user                      |
| GET    | /users                  | List users                       |
| GET    | /users/{id}             | Get user                         |
| PUT    | /users/{id}             | Update user                      |
| DELETE | /users/{id}             | Delete user                      |
| POST   | /customers              | Create customer                  |
| GET    | /customers              | List customers                   |
| GET    | /customers/{id}         | Get customer                     |
| GET    | /customers/{id}/full    | Get customer + simulations       |
| PUT    | /customers/{id}         | Update customer                  |
| DELETE | /customers/{id}         | Delete customer                  |
| POST   | /simulations            | Create simulation                |
| GET    | /simulations            | List simulations                 |
| GET    | /simulations/{id}       | Get simulation                   |
| PUT    | /simulations/{id}       | Update simulation                |
| DELETE | /simulations/{id}       | Delete simulation                |
| POST   | /impuestos              | Create tax                       |
| GET    | /impuestos              | List taxes                       |
| GET    | /impuestos/{id}         | Get tax                          |
| PUT    | /impuestos/{id}         | Update tax                       |
| DELETE | /impuestos/{id}         | Delete tax                       |
| POST   | /pricing-tiers          | Create pricing tier              |
| GET    | /pricing-tiers          | List pricing tiers               |
| GET    | /pricing-tiers/{id}     | Get pricing tier                 |
| PUT    | /pricing-tiers/{id}     | Update pricing tier              |
| DELETE | /pricing-tiers/{id}     | Delete pricing tier              |
