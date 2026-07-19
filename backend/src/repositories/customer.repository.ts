import { all, get, run } from '../database/sqlite.js';
import type {
  CreateCustomerInput,
  Customer,
  CustomerRow,
  UpdateCustomerInput,
} from '../models/index.js';

function mapCustomerRow(row: CustomerRow): Customer {
  return {
    id: row.id,
    companyName: row.company_name,
    taxId: row.tax_id,
    contactEmail: row.contact_email,
    country: row.country,
    planId: row.plan_id,
    createdAt: row.created_at,
  };
}

export class CustomerRepository {
  public async create(input: CreateCustomerInput): Promise<Customer> {
    const result = await run(
      `
        INSERT INTO customers (company_name, tax_id, contact_email, country, plan_id)
        VALUES (?, ?, ?, ?, ?);
      `,
      [input.companyName, input.taxId, input.contactEmail, input.country, input.planId],
    );

    const createdCustomer = await this.findById(result.lastId);

    if (createdCustomer === undefined) {
      throw new Error('No se pudo recuperar el cliente recién creado.');
    }

    return createdCustomer;
  }

  public async list(): Promise<Customer[]> {
    const rows = await all<CustomerRow>('SELECT * FROM customers ORDER BY id DESC;');
    return rows.map(mapCustomerRow);
  }

  public async findById(id: number): Promise<Customer | undefined> {
    const row = await get<CustomerRow>('SELECT * FROM customers WHERE id = ?;', [id]);
    return row === undefined ? undefined : mapCustomerRow(row);
  }

  public async update(id: number, input: UpdateCustomerInput): Promise<Customer | undefined> {
    await run(
      `
        UPDATE customers
        SET company_name = ?, tax_id = ?, contact_email = ?, country = ?, plan_id = ?
        WHERE id = ?;
      `,
      [input.companyName, input.taxId, input.contactEmail, input.country, input.planId, id],
    );

    return this.findById(id);
  }

  public async delete(id: number): Promise<boolean> {
    const result = await run('DELETE FROM customers WHERE id = ?;', [id]);
    return result.changes > 0;
  }
}
