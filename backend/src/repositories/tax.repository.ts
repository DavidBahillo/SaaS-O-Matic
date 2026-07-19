import { all, get, run } from '../database/sqlite.js';

interface TaxDbRow {
  id: number;
  country_name: string;
  tax_name: string;
  percentage: number;
  created_at: string;
}

interface TaxEntity {
  id: number;
  countryName: string;
  taxName: string;
  percentage: number;
  createdAt: string;
}

interface CreateTaxInput {
  countryName: string;
  taxName: string;
  percentage: number;
}

interface UpdateTaxInput {
  countryName: string;
  taxName: string;
  percentage: number;
}

function mapTaxRow(row: TaxDbRow): TaxEntity {
  return {
    id: row.id,
    countryName: row.country_name,
    taxName: row.tax_name,
    percentage: row.percentage,
    createdAt: row.created_at,
  };
}

export class TaxRepository {
  public async create(input: CreateTaxInput): Promise<TaxEntity> {
    const result = await run(
      `
        INSERT INTO impuestos (country_name, tax_name, percentage)
        VALUES (?, ?, ?);
      `,
      [input.countryName, input.taxName, input.percentage],
    );

    const createdTax = await this.findById(result.lastId);

    if (createdTax === undefined) {
      throw new Error('No se pudo recuperar el impuesto recién creado.');
    }

    return createdTax;
  }

  public async list(): Promise<TaxEntity[]> {
    const rows = await all<TaxDbRow>('SELECT * FROM impuestos ORDER BY country_name ASC;');
    return rows.map(mapTaxRow);
  }

  public async findById(id: number): Promise<TaxEntity | undefined> {
    const row = await get<TaxDbRow>('SELECT * FROM impuestos WHERE id = ?;', [id]);
    return row === undefined ? undefined : mapTaxRow(row);
  }

  public async findByCountryName(countryName: string): Promise<TaxEntity | undefined> {
    const row = await get<TaxDbRow>('SELECT * FROM impuestos WHERE country_name = ?;', [countryName]);
    return row === undefined ? undefined : mapTaxRow(row);
  }

  public async update(id: number, input: UpdateTaxInput): Promise<TaxEntity | undefined> {
    await run(
      `
        UPDATE impuestos
        SET country_name = ?, tax_name = ?, percentage = ?
        WHERE id = ?;
      `,
      [input.countryName, input.taxName, input.percentage, id],
    );

    return this.findById(id);
  }

  public async delete(id: number): Promise<boolean> {
    const result = await run('DELETE FROM impuestos WHERE id = ?;', [id]);
    return result.changes > 0;
  }
}
