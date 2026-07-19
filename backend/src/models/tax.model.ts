export interface TaxDbRow {
  id: number;
  country_name: string;
  tax_name: string;
  percentage: number;
  created_at: string;
}

export interface TaxEntity {
  id: number;
  countryName: string;
  taxName: string;
  percentage: number;
  createdAt: string;
}

export interface CreateTaxInput {
  countryName: string;
  taxName: string;
  percentage: number;
}

export interface UpdateTaxInput {
  countryName: string;
  taxName: string;
  percentage: number;
}
