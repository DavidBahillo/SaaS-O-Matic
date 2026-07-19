export type PlanOption = 'Plan Starter' | 'Plan Pro' | 'Plan Enterprise';

export interface CustomerRow {
  id: number;
  company_name: string;
  tax_id: string | null;
  contact_email: string;
  country: string;
  plan_id: PlanOption | null;
  created_at: string;
}

export interface Customer {
  id: number;
  companyName: string;
  taxId: string | null;
  contactEmail: string;
  country: string;
  planId: PlanOption | null;
  createdAt: string;
}

import type { Simulation } from './simulation.model.js';

export interface CustomerWithSimulations {
  customer: Customer;
  simulations: Simulation[];
}

export interface CreateCustomerInput {
  companyName: string;
  taxId: string | null;
  contactEmail: string;
  country: string;
  planId: PlanOption | null;
}

export interface UpdateCustomerInput {
  companyName: string;
  taxId: string | null;
  contactEmail: string;
  country: string;
  planId: PlanOption | null;
}
