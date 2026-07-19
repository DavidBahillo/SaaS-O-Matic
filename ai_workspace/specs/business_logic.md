# Business Logic: Gradual Tiered Billing Algorithm (Tiered Pricing)

## Objective

Calculate the monthly cost of a simulation based on the number of users through a **cumulative tiered pricing model (Tiered Pricing)**, applying the configured tax for the customer's country.

## Business rules

1. The number of users must be an integer greater than 0.
2. The price is calculated **cumulatively**, not by applying a single price to all users.
3. Billing tiers are obtained from the `pricing_tiers` table, ordered by `level` ascending.
4. Tax is obtained from the `impuestos` table according to the customer's `country`.
5. If there are no tiers configured in the database, the backend uses the default initially seeded tiers:

| Tier   | Users     | Price per user |
| ------ | --------- | -------------- |
| Tier 1 | 1 to 10   | 10 €           |
| Tier 2 | 11 to 50  | 8 €            |
| Tier 3 | More than 50 | 5 €         |

6. The last tier must have `user_limit = NULL` to represent that it has no upper limit.
7. Base cost is the sum of the amount calculated in each tier.
8. The corresponding tax (VAT/Tax) for the customer's country must be applied to the base cost.
9. If there is no configured tax for the indicated country, the backend uses a default VAT of **21%**.
10. Final cost is calculated using the formula:

```text
Tax = Base cost * (percentage / 100)
Final cost = Base cost + Tax
```

---

## Step-by-step algorithm

1. Receive the number of active users and the customer's country associated with the simulation.
2. Validate that the number of users is an integer greater than 0.
3. Obtain from the database the `pricing_tiers` tiers ordered by `level` ascending.
4. If the `pricing_tiers` table is empty, use the default initial configuration seeded by the backend.
5. Initialize base cost at **0 €**.
6. Iterate through the tiers and calculate cumulatively how many users belong to each tier.
7. Add to the base cost the amount of each tier: `users_in_tier * price_per_user`.
8. Obtain the applicable tax from the `impuestos` table using the customer's country.
9. If there is no tax for that country, apply the default 21%.
10. Calculate final cost and round it to two decimals.
11. Save the resulting `total_cost` in the simulation.
12. The current implementation persists the simulation's final cost; it does not store the base cost or the tax amount separately.

---

# Validation Rules for Spanish DNI, NIF, and CIF

## General rules

Before validating any document:

1. Remove leading and trailing spaces.
2. Remove internal spaces if the application allows them.
3. Convert all letters to uppercase.
4. Verify that the format matches the document type.
5. Validate the corresponding check digit or letter.
6. Reject documents with incorrect length or non-allowed characters.
7. Consider a document valid only if it passes both format validation and check character validation.

---

# 1. DNI (National Identity Document)

## Format

- 8 digits followed by a letter.

```regex
^[0-9]{8}[A-Z]$
```

Valid examples:

- `12345678Z`
- `00000000T`

## Letter validation

1. Get the number (8 digits).
2. Calculate:

```text
remainder = number % 23
```

3. Use the table:

```text
TRWAGMYFPDXBNJZSQVHLCKE
```

4. The DNI letter must match the position indicated by the obtained remainder.

### Example

```text
12345678 % 23 = 14

Position 14 → Z

Valid DNI:
12345678Z
```

---

# 2. NIF

## Spanish natural persons

It is validated exactly the same as a DNI.

---

## NIF with prefix K, L, or M

### Format

```regex
^[KLM][0-9]{7}[A-Z]$
```

The final letter must be calculated using the official control algorithm.

---

## NIE (Foreigner Identity Number)

### Format

```regex
^[XYZ][0-9]{7}[A-Z]$
```

### Algorithm

1. Replace the initial letter with its equivalent:

| Letter | Value |
| ------ | ----- |
| X      | 0     |
| Y      | 1     |
| Z      | 2     |

2. Form an eight-digit number.
3. Apply the same algorithm used for DNI.
4. Check that the check letter is correct.

### Example

```text
X1234567L

↓

01234567

↓

01234567 % 23

↓

Check letter
```

---

# 3. CIF (Tax Identification Code)

## Format

```regex
^[ABCDEFGHJKLMNPQRSUVW][0-9]{7}[0-9A-J]$
```

## Structure

- 1 initial letter (entity type).
- 7 digits.
- 1 control character (numeric or alphabetic).

Example:

```text
B12345674
```

## Validation algorithm

1. Separate the seven digits.
2. Sum the digits located in even positions.
3. Multiply by 2 the digits located in odd positions.
4. If the result of a multiplication has two digits, sum both digits.

Example:

```text
14 → 1 + 4 = 5
```

5. Sum all obtained values.
6. Calculate the control digit:

```text
control = (10 - (sum % 10)) % 10
```

7. Compare the result with the final CIF character.

### Considerations

Depending on the initial CIF letter:

- Some entities use exclusively a numeric control digit.
- Others use exclusively a control letter.
- Some accept either of the two formats according to current regulations.
