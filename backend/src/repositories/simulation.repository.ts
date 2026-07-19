import { all, get, run } from '../database/sqlite.js';
import type {
  CreateSimulationInput,
  Simulation,
  SimulationRow,
  SimulationFilters,
  UpdateSimulationInput,
} from '../models/index.js';

function mapSimulationRow(row: SimulationRow): Simulation {
  return {
    id: row.id,
    customerId: row.customer_id,
    budgetName: row.budget_name ?? `Simulación #${row.id}`,
    activeUsers: row.active_users,
    storage: row.storage,
    apiCalls: row.api_calls,
    totalCost: row.total_cost,
    currency: row.currency,
    createdAt: row.created_at,
  };
}

export class SimulationRepository {
  public async create(input: CreateSimulationInput, totalCost: number): Promise<Simulation> {
    const result = await run(
      `
        INSERT INTO simulations (customer_id, budget_name, active_users, storage, api_calls, total_cost, currency)
        VALUES (?, ?, ?, ?, ?, ?, ?);
      `,
      [input.customerId, input.budgetName, input.activeUsers, input.storage, input.apiCalls, totalCost, input.currency],
    );

    const createdSimulation = await this.findById(result.lastId);

    if (createdSimulation === undefined) {
      throw new Error('No se pudo recuperar la simulación recién creada.');
    }

    return createdSimulation;
  }

  public async list(filters: SimulationFilters): Promise<Simulation[]> {
    const conditions: string[] = [];
    const parameters: number[] = [];

    if (filters.customerId !== undefined) {
      conditions.push('customer_id = ?');
      parameters.push(filters.customerId);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const rows = await all<SimulationRow>(`SELECT * FROM simulations ${whereClause} ORDER BY id DESC;`, parameters);

    return rows.map(mapSimulationRow);
  }

  public async findById(id: number): Promise<Simulation | undefined> {
    const row = await get<SimulationRow>('SELECT * FROM simulations WHERE id = ?;', [id]);
    return row === undefined ? undefined : mapSimulationRow(row);
  }

  public async update(id: number, input: UpdateSimulationInput, totalCost: number): Promise<Simulation | undefined> {
    await run(
      `
        UPDATE simulations
        SET budget_name = ?, active_users = ?, storage = ?, api_calls = ?, total_cost = ?, currency = ?
        WHERE id = ?;
      `,
      [input.budgetName, input.activeUsers, input.storage, input.apiCalls, totalCost, input.currency, id],
    );

    return this.findById(id);
  }

  public async delete(id: number): Promise<boolean> {
    const result = await run('DELETE FROM simulations WHERE id = ?;', [id]);
    return result.changes > 0;
  }
}
