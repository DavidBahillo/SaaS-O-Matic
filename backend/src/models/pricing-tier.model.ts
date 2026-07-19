export interface PricingTierRow {
  id: number;
  level: number;
  user_limit: number | null;
  price_per_user: number;
  created_at: string;
}

export interface PricingTier {
  id: number;
  level: number;
  userLimit: number | null;
  pricePerUser: number;
  createdAt: string;
}

export interface PricingTierConfig {
  level: number;
  userLimit: number | null;
  pricePerUser: number;
}

export interface CreatePricingTierInput {
  level: number;
  userLimit: number | null;
  pricePerUser: number;
}

export interface UpdatePricingTierInput {
  level: number;
  userLimit: number | null;
  pricePerUser: number;
}
