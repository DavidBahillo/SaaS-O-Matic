export interface SimulationRow {
  id: number;
  customer_id: number;
  budget_name: string;
  active_users: number;
  storage: number;
  api_calls: number;
  total_cost: number;
  currency: string;
  created_at: string;
}

export interface Simulation {
  id: number;
  customerId: number;
  budgetName: string;
  activeUsers: number;
  storage: number;
  apiCalls: number;
  totalCost: number;
  currency: string;
  createdAt: string;
}

export interface CreateSimulationInput {
  customerId: number;
  budgetName: string;
  activeUsers: number;
  storage: number;
  apiCalls: number;
  currency: string;
}

export interface UpdateSimulationInput {
  budgetName: string;
  activeUsers: number;
  storage: number;
  apiCalls: number;
  currency: string;
}

export interface SimulationFilters {
  customerId?: number;
}
