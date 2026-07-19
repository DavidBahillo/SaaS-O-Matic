import { all, exec, get, run } from '../database/sqlite.js';
import type {
  CreatePricingTierInput,
  PricingTier,
  PricingTierConfig,
  PricingTierRow,
  UpdatePricingTierInput,
} from '../models/index.js';

function mapPricingTierRow(row: PricingTierRow): PricingTier {
  return {
    id: row.id,
    level: row.level,
    userLimit: row.user_limit,
    pricePerUser: row.price_per_user,
    createdAt: row.created_at,
  };
}

export class PricingTierRepository {
  public async create(input: CreatePricingTierInput): Promise<PricingTier> {
    const result = await run(
      `
        INSERT INTO pricing_tiers (level, user_limit, price_per_user)
        VALUES (?, ?, ?);
      `,
      [input.level, input.userLimit, input.pricePerUser],
    );

    const createdTier = await this.findById(result.lastId);

    if (createdTier === undefined) {
      throw new Error('No se pudo recuperar el tramo de precio recién creado.');
    }

    return createdTier;
  }

  public async list(): Promise<PricingTier[]> {
    const rows = await all<PricingTierRow>('SELECT * FROM pricing_tiers ORDER BY level ASC;');
    return rows.map(mapPricingTierRow);
  }

  public async findById(id: number): Promise<PricingTier | undefined> {
    const row = await get<PricingTierRow>('SELECT * FROM pricing_tiers WHERE id = ?;', [id]);
    return row === undefined ? undefined : mapPricingTierRow(row);
  }

  public async findByLevel(level: number): Promise<PricingTier | undefined> {
    const row = await get<PricingTierRow>('SELECT * FROM pricing_tiers WHERE level = ?;', [level]);
    return row === undefined ? undefined : mapPricingTierRow(row);
  }

  public async update(id: number, input: UpdatePricingTierInput): Promise<PricingTier | undefined> {
    await run(
      `
        UPDATE pricing_tiers
        SET level = ?, user_limit = ?, price_per_user = ?
        WHERE id = ?;
      `,
      [input.level, input.userLimit, input.pricePerUser, id],
    );

    return this.findById(id);
  }

  public async delete(id: number): Promise<boolean> {
    const result = await run('DELETE FROM pricing_tiers WHERE id = ?;', [id]);
    return result.changes > 0;
  }

  public async replaceAll(tiers: readonly PricingTierConfig[]): Promise<PricingTier[]> {
    await exec('BEGIN TRANSACTION;');

    try {
      await run('DELETE FROM pricing_tiers;');

      for (const tier of tiers) {
        await run(
          `
            INSERT INTO pricing_tiers (level, user_limit, price_per_user)
            VALUES (?, ?, ?);
          `,
          [tier.level, tier.userLimit, tier.pricePerUser],
        );
      }

      await exec('COMMIT;');
    } catch (error) {
      await exec('ROLLBACK;');
      throw error;
    }

    return this.list();
  }
}
