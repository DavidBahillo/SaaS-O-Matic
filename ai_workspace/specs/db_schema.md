# Table definitions

The tables that make up the database are defined below.
The database is made up of five main tables:

- **customers**: stores information about the companies or clients that use the application.
- **simulations**: stores the cost simulations carried out for each client.
- **impuestos**: stores the applicable tax by country.
- **pricing_tiers**: stores the billing tier configuration.
- **users**: stores the application's internal users with their role and access credentials.



## `users` table

The `users` table stores the internal users who access the application. It records the user's personal data, unique email address, password stored as a hash, and the role that determines their access level within the system.

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

The `rol` field accepts two values: `'admin'` for users with full access and `'usuario'` for standard access. The `contrasena` field never stores plain text: it is saved as a hash derived using `scrypt` with random salt. When initializing the database, two default users are automatically inserted if they do not exist.

The main operational relationship is between `customers` and `simulations`, through a foreign key that allows a client to have several associated simulations.

## `customers` table

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



## `simulations` table

The `simulations` table stores the simulations carried out. It records the parameters used for cost calculation, such as the budget name, number of active users, required storage, and API calls, in addition to the total cost obtained and the simulation creation date.

```sql
 CREATE TABLE  simulations (
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

## `impuestos` table

The `impuestos` table stores taxes by country. It records the parameters used to calculate the percentage applicable to a simulation according to the client's country.

```sql
CREATE TABLE impuestos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    country_name TEXT NOT NULL UNIQUE,
    tax_name TEXT NOT NULL,
    percentage REAL NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## `pricing_tiers` table

The `pricing_tiers` table stores the tier configuration used by the cumulative billing algorithm.

```sql
CREATE TABLE pricing_tiers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    level INTEGER NOT NULL UNIQUE CHECK (level > 0),
    user_limit INTEGER CHECK (user_limit IS NULL OR user_limit > 0),
    price_per_user REAL NOT NULL CHECK (price_per_user >= 0),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

The last tier must have `user_limit = NULL` to represent that there is no upper limit. When the table is empty, the backend automatically inserts an initial configuration with three tiers.

## Indexes

To optimize queries that retrieve simulations for a specific client, an index is created on the `customer_id` field.

```sql
CREATE INDEX idx_simulations_customer_id
ON simulations(customer_id);
```

Additionally, an index is created on `level` in `pricing_tiers` to efficiently retrieve tiers ordered by level.

```sql
CREATE INDEX idx_pricing_tiers_level
ON pricing_tiers(level);
```

## Relationship between tables

The `simulations` table is related to the `customers` table through the `customer_id` foreign key, which references the `id` field in the `customers` table.

This relationship is **one to many (1:N)**, since the same client can run several simulations, while each simulation belongs to only one client.

Additionally, the following constraints have been defined on the foreign key:

- **ON DELETE CASCADE**: when a client is deleted, all their simulations are also automatically deleted.
- **ON UPDATE CASCADE**: if the client identifier is modified, references in the `simulations` table are automatically updated.

The `impuestos` and `pricing_tiers` tables act as configuration tables and do not depend on `customers` or `simulations` through foreign keys.