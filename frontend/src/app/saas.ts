import {
  Injectable,
  signal,
  computed,
  inject,
  PLATFORM_ID,
} from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { isPlatformBrowser } from "@angular/common";
import { firstValueFrom } from "rxjs";
//Sistema de facturación y presupuestos para SaaS. Se ha eliminado la funcionalidad de facturas para simplificar el proyecto y centrarse en la gestión de clientes y presupuestos.

// export interface Invoice {
//   id: string;
//   date: string;
//   amount: number;
//   status: "PAGADO" | "PENDIENTE" | "CANCELADO";
// }

export interface Quote {
  simulationId: number;
  title: string;
  users: number;
  totalCost: number;
  currency: string;
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  cif: string;
  country: string;
  countryCode: string;
  email: string;
  plan: "Plan Starter" | "Plan Pro" | "Plan Enterprise";
  createdDate: string;
  sector: string;
  totalRevenue: number;
  active: boolean;
  // billingHistory: Invoice[];
  quotes: Quote[];
}

export interface Tier {
  id: number;
  level: number;
  limit: number | null; // null for infinite tier
  price: number;
}

export interface Tax {
  id?: number;
  country: string;
  countryCode: string;
  taxName: string;
  percentage: number;
}

export type UserRole = "admin" | "usuario";

export interface AppUser {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: UserRole;
  createdAt: string;
}

export interface SupportedCountryOption {
  countryCode: string;
  countryName: string;
  currencyCode: string;
}

interface DefaultTaxConfig {
  taxName: string;
  percentage: number;
}

interface ApiCustomer {
  id: number;
  companyName: string;
  taxId: string | null;
  contactEmail: string;
  country: string;
  planId: "Plan Starter" | "Plan Pro" | "Plan Enterprise" | null;
  createdAt: string;
}

interface ApiSimulation {
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

interface ApiPricingTier {
  id: number;
  level: number;
  userLimit: number | null;
  pricePerUser: number;
  createdAt: string;
}

interface ApiTax {
  id: number;
  countryName: string;
  taxName: string;
  percentage: number;
  createdAt: string;
}

interface ApiUser {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: UserRole;
  createdAt: string;
}

interface ApiLoginPayload {
  email: string;
  contrasena: string;
}

interface ExchangeRatesApiResponse {
  result: string;
  base_code: string;
  time_last_update_utc: string;
  rates: Record<string, number>;
}

interface ApiCustomerWithSimulations {
  customer: ApiCustomer;
  simulations: ApiSimulation[];
}
//Como se va a utilizar solo en local se pueden dejar aqui pero tendria que ir ocultas
const API_BASE_URL = "http://localhost:3001";
const EXCHANGE_API_URL = "https://open.er-api.com/v6/latest/EUR";
const AUTH_STORAGE_KEY = "saas_o_matic_auth";
const COUNTRY_NAMES: Record<string, string> = {
  es: "España",
  fr: "Francia",
  de: "Alemania",
  us: "Estados Unidos",
  mx: "México",
  ar: "Argentina",
  co: "Colombia",
  cl: "Chile",
  it: "Italia",
  gb: "Reino Unido",
};

const regionNames = new Intl.DisplayNames(["es-ES"], { type: "region" });

const SUPPORTED_COUNTRY_CURRENCIES: readonly SupportedCountryOption[] = [
  { countryCode: "es", countryName: "España", currencyCode: "EUR" },
{ countryCode: "fr", countryName: "Francia", currencyCode: "EUR" },
{ countryCode: "de", countryName: "Alemania", currencyCode: "EUR" },
{ countryCode: "it", countryName: "Italia", currencyCode: "EUR" },
{ countryCode: "pt", countryName: "Portugal", currencyCode: "EUR" },
{ countryCode: "nl", countryName: "Países Bajos", currencyCode: "EUR" },
{ countryCode: "be", countryName: "Bélgica", currencyCode: "EUR" },
{ countryCode: "ie", countryName: "Irlanda", currencyCode: "EUR" },
{ countryCode: "at", countryName: "Austria", currencyCode: "EUR" },
{ countryCode: "fi", countryName: "Finlandia", currencyCode: "EUR" },
{ countryCode: "gr", countryName: "Grecia", currencyCode: "EUR" },
{ countryCode: "us", countryName: "Estados Unidos", currencyCode: "USD" },
{ countryCode: "ca", countryName: "Canadá", currencyCode: "CAD" },
{ countryCode: "mx", countryName: "México", currencyCode: "MXN" },
{ countryCode: "gb", countryName: "Reino Unido", currencyCode: "GBP" },
{ countryCode: "ch", countryName: "Suiza", currencyCode: "CHF" },
{ countryCode: "no", countryName: "Noruega", currencyCode: "NOK" },
{ countryCode: "se", countryName: "Suecia", currencyCode: "SEK" },
{ countryCode: "dk", countryName: "Dinamarca", currencyCode: "DKK" },
{ countryCode: "jp", countryName: "Japón", currencyCode: "JPY" },
{ countryCode: "cn", countryName: "China", currencyCode: "CNY" },
{ countryCode: "kr", countryName: "Corea del Sur", currencyCode: "KRW" },
{ countryCode: "in", countryName: "India", currencyCode: "INR" },
{ countryCode: "sg", countryName: "Singapur", currencyCode: "SGD" },
{ countryCode: "hk", countryName: "Hong Kong", currencyCode: "HKD" },
{
  countryCode: "ae",
  countryName: "Emiratos Árabes Unidos",
  currencyCode: "AED",
},
{ countryCode: "au", countryName: "Australia", currencyCode: "AUD" },
{ countryCode: "nz", countryName: "Nueva Zelanda", currencyCode: "NZD" },
{ countryCode: "br", countryName: "Brasil", currencyCode: "BRL" },
{ countryCode: "ar", countryName: "Argentina", currencyCode: "ARS" },
{ countryCode: "cl", countryName: "Chile", currencyCode: "CLP" },
{ countryCode: "co", countryName: "Colombia", currencyCode: "COP" },
{ countryCode: "pe", countryName: "Perú", currencyCode: "PEN" },
{ countryCode: "uy", countryName: "Uruguay", currencyCode: "UYU" },
{ countryCode: "za", countryName: "Sudáfrica", currencyCode: "ZAR" },
{ countryCode: "tr", countryName: "Turquía", currencyCode: "TRY" },
{ countryCode: "pl", countryName: "Polonia", currencyCode: "PLN" },
{ countryCode: "cz", countryName: "República Checa", currencyCode: "CZK" },
{ countryCode: "hu", countryName: "Hungría", currencyCode: "HUF" },
{ countryCode: "ro", countryName: "Rumanía", currencyCode: "RON" },
];

const DEFAULT_TAX_CONFIG_BY_COUNTRY: Record<string, DefaultTaxConfig> = {
  es: { taxName: "IVA", percentage: 21 },
  fr: { taxName: "TVA", percentage: 20 },
  de: { taxName: "MwSt", percentage: 19 },
  it: { taxName: "IVA", percentage: 22 },
  pt: { taxName: "IVA", percentage: 23 },
  nl: { taxName: "BTW", percentage: 21 },
  be: { taxName: "TVA", percentage: 21 },
  ie: { taxName: "VAT", percentage: 23 },
  at: { taxName: "USt", percentage: 20 },
  fi: { taxName: "ALV", percentage: 25.5 },
  gr: { taxName: "FPA", percentage: 24 },
  us: { taxName: "Sales Tax", percentage: 8 },
  ca: { taxName: "GST/HST", percentage: 13 },
  mx: { taxName: "IVA", percentage: 16 },
  gb: { taxName: "VAT", percentage: 20 },
  ch: { taxName: "VAT", percentage: 8.1 },
  no: { taxName: "MVA", percentage: 25 },
  se: { taxName: "MOMS", percentage: 25 },
  dk: { taxName: "MOMS", percentage: 25 },
  jp: { taxName: "Consumption Tax", percentage: 10 },
  cn: { taxName: "VAT", percentage: 13 },
  kr: { taxName: "VAT", percentage: 10 },
  in: { taxName: "GST", percentage: 18 },
  sg: { taxName: "GST", percentage: 9 },
  hk: { taxName: "No VAT", percentage: 0 },
  ae: { taxName: "VAT", percentage: 5 },
  au: { taxName: "GST", percentage: 10 },
  nz: { taxName: "GST", percentage: 15 },
  br: { taxName: "ICMS", percentage: 17 },
  ar: { taxName: "IVA", percentage: 21 },
  cl: { taxName: "IVA", percentage: 19 },
  co: { taxName: "IVA", percentage: 19 },
  pe: { taxName: "IGV", percentage: 18 },
  uy: { taxName: "IVA", percentage: 22 },
  za: { taxName: "VAT", percentage: 15 },
  tr: { taxName: "KDV", percentage: 20 },
  pl: { taxName: "VAT", percentage: 23 },
  cz: { taxName: "DPH", percentage: 21 },
  hu: { taxName: "AFA", percentage: 27 },
  ro: { taxName: "TVA", percentage: 19 },
};

function toDisplayCountryName(countryOrCode: string): string {
  const normalized = countryOrCode.trim();
  const normalizedCode = normalized.toLowerCase();

  if (COUNTRY_NAMES[normalizedCode] !== undefined) {
    return COUNTRY_NAMES[normalizedCode];
  }

  // If backend sends ISO code, resolve it to a localized country label.
  if (/^[a-zA-Z]{2}$/.test(normalized)) {
    return regionNames.of(normalized.toUpperCase()) ?? normalized.toUpperCase();
  }

  return normalized;
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function toCountryCode(countryOrCode: string): string {
  const normalized = countryOrCode.trim();
  const lower = normalized.toLowerCase();

  if (/^[a-z]{2}$/.test(lower)) {
    return lower;
  }

  const byAlias = Object.entries(COUNTRY_NAMES).find(
    ([, name]) => normalizeText(name) === normalizeText(normalized),
  );
  if (byAlias) {
    return byAlias[0];
  }

  const bySupported = SUPPORTED_COUNTRY_CURRENCIES.find(
    (item) => normalizeText(item.countryName) === normalizeText(normalized),
  );
  if (bySupported) {
    return bySupported.countryCode.toLowerCase();
  }

  return lower;
}

function findTaxForCountry(
  taxes: Tax[],
  countryOrCode: string,
): Tax | undefined {
  const normalizedCountryCode = toCountryCode(countryOrCode);
  const byCode = taxes.find(
    (tax) => toCountryCode(tax.countryCode) === normalizedCountryCode,
  );

  if (byCode) {
    return byCode;
  }

  const normalizedCountryName = normalizeText(
    toDisplayCountryName(countryOrCode),
  );
  return taxes.find(
    (tax) => normalizeText(tax.country) === normalizedCountryName,
  );
}

function getDefaultTaxByCountryCode(countryCode: string): DefaultTaxConfig {
  const normalizedCountryCode = toCountryCode(countryCode);
  const config = DEFAULT_TAX_CONFIG_BY_COUNTRY[normalizedCountryCode];

  if (config) {
    return config;
  }

  return {
    taxName: "IVA",
    percentage: 21,
  };
}

function createDefaultTax(option: SupportedCountryOption): Tax {
  const defaultTax = getDefaultTaxByCountryCode(option.countryCode);

  return {
    country: option.countryName,
    countryCode: option.countryCode,
    taxName: defaultTax.taxName,
    percentage: defaultTax.percentage,
  };
}

function formatMonthYear(isoDate: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
  }).format(new Date(isoDate));
}

function formatShortDate(isoDate: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

@Injectable({
  providedIn: "root",
})
export class Saas {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly apiBaseUrl = API_BASE_URL;

  // Navigation State
  currentView = signal<
    | "dashboard"
    | "clientes"
    | "detalle-cliente"
    | "presupuesto"
    | "analiticas"
    | "ajustes"
    | "usuarios"
  >("dashboard");
  currentSettingsTab = signal<"perfil" | "precios" | "impuestos">("perfil");

  // Selected Contexts
  selectedClient = signal<Customer | null>(null);
  activeEditClient = signal<Customer | null>(null);
  activeEditUser = signal<AppUser | null>(null);
  activeEditQuote = signal<Quote | null>(null);
  activeEditQuoteCustomerId = signal<string | null>(null);

  // Exchange rates (base EUR)
  exchangeRates = signal<Record<string, number>>({ EUR: 1 });
  exchangeRatesUpdatedAt = signal<string | null>(null);
  exchangeRatesLoading = signal(false);
  customerCountryOptions = computed(() => {
    const rates = this.exchangeRates();
    return SUPPORTED_COUNTRY_CURRENCIES.filter(
      (option) => rates[option.currencyCode] !== undefined,
    ).sort((a, b) => a.countryName.localeCompare(b.countryName));
  });

  // Modals Visibility
  showAddClientModal = signal(false);
  showEditClientModal = signal(false);
  showAddTaxModal = signal(false);
  showAddUserModal = signal(false);

  // Search state for various tables/lists
  globalSearch = signal("");
  clientSearch = signal("");
  taxSearch = signal("");

  // User Profile
  isAuthenticated = signal(false);
  currentUserId = signal<number | null>(null);
  currentUserRole = signal<UserRole | null>(null);
  currentUserIsAdmin = computed(() => this.currentUserRole() === "admin");
  userProfile = signal({
    name: "Jane",
    surname: "Doe Smith",
    email: "jane.doe@saas-o-matic.com",
    role: "usuario" as UserRole,
  });

  users = signal<AppUser[]>([]);

  // Master Data: Pricing Tiers
  tiers = signal<Tier[]>([
    { id: 1, level: 1, limit: 10, price: 45 },
    { id: 2, level: 2, limit: 50, price: 35 },
    { id: 3, level: 3, limit: null, price: 25 },
  ]);

  // Master Data: Taxes per Country
  taxes = signal<Tax[]>([
    {
      id: 1,
      country: "España",
      countryCode: "es",
      taxName: "IVA",
      percentage: 21,
    },
    {
      id: 2,
      country: "Francia",
      countryCode: "fr",
      taxName: "TVA",
      percentage: 20,
    },
    {
      id: 3,
      country: "Alemania",
      countryCode: "de",
      taxName: "MwSt",
      percentage: 19,
    },
    {
      id: 4,
      country: "Estados Unidos",
      countryCode: "us",
      taxName: "Sales Tax",
      percentage: 0,
    },
  ]);

  // Master Data: Customers
  clients = signal<Customer[]>([]);

  public constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.restoreSession();

      if (this.isAuthenticated()) {
        void this.bootstrapAuthenticatedData();
      }
    }
  }

  private async bootstrapAuthenticatedData(): Promise<void> {
    try {
      await Promise.all([
        this.loadExchangeRates(),
        this.loadPricingTiers(),
        this.loadTaxes(),
        this.loadCustomers(),
        this.loadCurrentUserProfile(),
        this.loadUsers(),
      ]);
    } catch {
      this.logout();
      throw new Error(
        "No se pudo restaurar la sesion. Inicia sesion de nuevo.",
      );
    }
  }

  private persistSession(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const userId = this.currentUserId();

    if (userId === null) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ userId }));
  }

  private restoreSession(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (raw === null) {
      this.isAuthenticated.set(false);
      this.currentUserId.set(null);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as { userId?: unknown };
      const userId = parsed.userId;

      if (
        typeof userId === "number" &&
        Number.isInteger(userId) &&
        userId > 0
      ) {
        this.currentUserId.set(userId);
        this.isAuthenticated.set(true);
        return;
      }
    } catch {
      // Ignore malformed session payload and clear local state below.
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    this.currentUserId.set(null);
    this.isAuthenticated.set(false);
  }

  private mapApiUserToProfile(user: ApiUser): {
    name: string;
    surname: string;
    email: string;
    role: UserRole;
  } {
    return {
      name: user.nombre,
      surname: user.apellido,
      email: user.email,
      role: user.rol,
    };
  }

  private getAuthenticatedHeaders(): HttpHeaders {
    const userId = this.currentUserId();

    if (userId === null) {
      throw new Error("No hay una sesion activa para esta operacion.");
    }

    return new HttpHeaders({ "x-user-id": String(userId) });
  }

  private mapApiCustomerToUi(customer: ApiCustomer): Customer {
    const countryCode = toCountryCode(customer.country);
    const countryMatch = this.taxes().find(
      (tax) => toCountryCode(tax.countryCode) === countryCode,
    );
    const countryName =
      countryMatch?.country ?? toDisplayCountryName(customer.country);

    return {
      id: String(customer.id),
      name: customer.companyName,
      cif: customer.taxId ?? "N/A",
      country: countryName,
      countryCode,
      email: customer.contactEmail,
      plan: customer.planId ?? "Plan Starter",
      createdDate: formatMonthYear(customer.createdAt),
      sector: "General",
      totalRevenue: 0,
      active: true,
      // billingHistory: [],
      quotes: [],
    };
  }

  private mapApiSimulationToQuote(simulation: ApiSimulation): Quote {
    return {
      simulationId: simulation.id,
      title: simulation.budgetName || `Simulación #${simulation.id}`,
      users: simulation.activeUsers,
      totalCost: simulation.totalCost,
      currency: simulation.currency,
      date: formatShortDate(simulation.createdAt),
    };
  }

  private mapApiPricingTierToUi(tier: ApiPricingTier): Tier {
    return {
      id: tier.id,
      level: tier.level,
      limit: tier.userLimit,
      price: tier.pricePerUser,
    };
  }

  private mapApiTaxToUi(tax: ApiTax): Tax {
    const countryCode = toCountryCode(tax.countryName);
    return {
      id: tax.id,
      countryCode,
      country: toDisplayCountryName(tax.countryName),
      taxName: tax.taxName,
      percentage: tax.percentage,
    };
  }

  public async loadExchangeRates(): Promise<void> {
    this.exchangeRatesLoading.set(true);

    try {
      const response = await firstValueFrom(
        this.http.get<ExchangeRatesApiResponse>(EXCHANGE_API_URL),
      );

      if (response.result !== "success") {
        throw new Error(
          "No fue posible obtener los tipos de cambio en este momento.",
        );
      }

      this.exchangeRates.set(response.rates);
      this.exchangeRatesUpdatedAt.set(response.time_last_update_utc);
    } finally {
      this.exchangeRatesLoading.set(false);
    }
  }

  public getExchangeRate(currencyCode: string): number {
    const rate = this.exchangeRates()[currencyCode.toUpperCase()];
    return typeof rate === "number" && Number.isFinite(rate) ? rate : 1;
  }

  public convertFromEur(
    amountInEur: number,
    targetCurrencyCode: string,
  ): number {
    return amountInEur * this.getExchangeRate(targetCurrencyCode);
  }

  public formatCurrency(amount: number, currencyCode: string): string {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: currencyCode.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  public getSuggestedCurrencyForCountry(countryCode: string): string {
    const normalizedCountryCode = toCountryCode(countryCode);
    const option = SUPPORTED_COUNTRY_CURRENCIES.find(
      (item) => item.countryCode.toLowerCase() === normalizedCountryCode,
    );

    return option?.currencyCode ?? "EUR";
  }

  public getDisplayCountryName(countryOrCode: string): string {
    return toDisplayCountryName(countryOrCode);
  }

  public async createSimulation(input: {
    customerId: string;
    budgetName: string;
    activeUsers: number;
    currency: string;
  }): Promise<void> {
    const payload = {
      customerId: Number(input.customerId),
      budgetName: input.budgetName,
      activeUsers: input.activeUsers,
      storage: 0,
      apiCalls: 0,
      currency: input.currency,
    };

    await firstValueFrom(
      this.http.post<ApiSimulation>(`${this.apiBaseUrl}/simulations`, payload),
    );
    await this.loadCustomerDetail(input.customerId);
  }

  public async updateSimulation(input: {
    simulationId: number;
    customerId: string;
    budgetName: string;
    activeUsers: number;
    currency: string;
  }): Promise<void> {
    const payload = {
      budgetName: input.budgetName,
      activeUsers: input.activeUsers,
      currency: input.currency,
    };

    await firstValueFrom(
      this.http.put<ApiSimulation>(
        `${this.apiBaseUrl}/simulations/${input.simulationId}`,
        payload,
      ),
    );

    await this.loadCustomerDetail(input.customerId);
  }

  public async deleteSimulation(
    simulationId: number,
    customerId: string,
  ): Promise<void> {
    await firstValueFrom(
      this.http.delete<void>(`${this.apiBaseUrl}/simulations/${simulationId}`),
    );
    await this.loadCustomerDetail(customerId);
  }

  public startQuoteEdition(quote: Quote, customerId: string): void {
    this.activeEditQuote.set(quote);
    this.activeEditQuoteCustomerId.set(customerId);
  }

  public clearQuoteEdition(): void {
    this.activeEditQuote.set(null);
    this.activeEditQuoteCustomerId.set(null);
  }

  public async loadCustomers(): Promise<void> {
    const customers = await firstValueFrom(
      this.http.get<ApiCustomer[]>(`${this.apiBaseUrl}/customers`),
    );

    this.clients.set(
      customers.map((customer) => this.mapApiCustomerToUi(customer)),
    );
  }

  public async loadPricingTiers(): Promise<void> {
    const tiers = await firstValueFrom(
      this.http.get<ApiPricingTier[]>(`${this.apiBaseUrl}/pricing-tiers`),
    );

    this.tiers.set(tiers.map((tier) => this.mapApiPricingTierToUi(tier)));
  }

  public async savePricingTiersConfig(): Promise<void> {
    const sortedByLimit = [...this.tiers()].sort((a, b) => {
      if (a.limit === null) return 1;
      if (b.limit === null) return -1;
      return a.limit - b.limit;
    });

    const payload = sortedByLimit.map((tier, index) => ({
      level: index + 1,
      userLimit: tier.limit,
      pricePerUser: tier.price,
    }));

    const saved = await firstValueFrom(
      this.http.put<ApiPricingTier[]>(
        `${this.apiBaseUrl}/pricing-tiers`,
        payload,
      ),
    );

    this.tiers.set(saved.map((tier) => this.mapApiPricingTierToUi(tier)));
  }

  public async loadTaxes(): Promise<void> {
    const taxes = await firstValueFrom(
      this.http.get<ApiTax[]>(`${this.apiBaseUrl}/impuestos`),
    );

    const mappedTaxes = taxes.map((tax) => this.mapApiTaxToUi(tax));
    const byCountryCode = new Map(
      mappedTaxes.map((tax) => [toCountryCode(tax.countryCode), tax]),
    );

    const completedFromSupported = SUPPORTED_COUNTRY_CURRENCIES.map(
      (option) => {
        const normalizedCountryCode = toCountryCode(option.countryCode);
        return (
          byCountryCode.get(normalizedCountryCode) ?? createDefaultTax(option)
        );
      },
    );

    const extraBackendTaxes = mappedTaxes.filter((tax) => {
      const normalizedCountryCode = toCountryCode(tax.countryCode);
      return !SUPPORTED_COUNTRY_CURRENCIES.some(
        (option) => toCountryCode(option.countryCode) === normalizedCountryCode,
      );
    });

    this.taxes.set(
      [...completedFromSupported, ...extraBackendTaxes].sort((a, b) =>
        a.country.localeCompare(b.country),
      ),
    );
  }

  public async loadCustomerDetail(customerId: string): Promise<void> {
    const response = await firstValueFrom(
      this.http.get<ApiCustomerWithSimulations>(
        `${this.apiBaseUrl}/customers/${customerId}/full`,
      ),
    );

    const mappedCustomer: Customer = {
      ...this.mapApiCustomerToUi(response.customer),
      quotes: response.simulations.map((simulation) =>
        this.mapApiSimulationToQuote(simulation),
      ),
    };

    this.clients.update((list) =>
      list.map((client) =>
        client.id === mappedCustomer.id ? mappedCustomer : client,
      ),
    );
    this.selectedClient.set(mappedCustomer);
  }

  // Derived Statistics (for Analytics view)
  totalClientsCount = computed(() => this.clients().length);

  starterClientsCount = computed(
    () => this.clients().filter((c) => c.plan === "Plan Starter").length,
  );
  proClientsCount = computed(
    () => this.clients().filter((c) => c.plan === "Plan Pro").length,
  );
  enterpriseClientsCount = computed(
    () => this.clients().filter((c) => c.plan === "Plan Enterprise").length,
  );

  clientsByCountry = computed(() => {
    const map: Record<
      string,
      { count: number; countryCode: string; percentage: number }
    > = {};
    const list = this.clients();
    list.forEach((c) => {
      if (!map[c.country]) {
        map[c.country] = {
          count: 0,
          countryCode: c.countryCode,
          percentage: 0,
        };
      }
      map[c.country].count++;
    });

    const total = list.length || 1;
    const result = Object.entries(map).map(([country, val]) => ({
      country,
      count: val.count,
      countryCode: val.countryCode,
      percentage: Math.round((val.count / total) * 100),
    }));

    return result.sort((a, b) => b.count - a.count);
  });

  // Actions for Clients
  async selectClient(client: Customer): Promise<void> {
    this.selectedClient.set(client);
    this.currentView.set("detalle-cliente");
    await this.loadCustomerDetail(client.id);
  }

  async addClient(newClient: {
    name: string;
    cif: string;
    countryCode: string;
    email: string;
    plan: "Plan Starter" | "Plan Pro" | "Plan Enterprise";
  }): Promise<void> {
    const payload = {
      companyName: newClient.name,
      taxId: newClient.cif.trim() === "" ? null : newClient.cif,
      contactEmail: newClient.email,
      country: newClient.countryCode.toUpperCase(),
      planId: newClient.plan,
    };

    const created = await firstValueFrom(
      this.http.post<ApiCustomer>(`${this.apiBaseUrl}/customers`, payload),
    );

    const mapped = this.mapApiCustomerToUi(created);
    this.clients.update((list) => [mapped, ...list]);
    this.showAddClientModal.set(false);
  }

  async updateClient(updated: Customer): Promise<void> {
    const payload = {
      companyName: updated.name,
      taxId:
        updated.cif.trim() === "" || updated.cif === "N/A" ? null : updated.cif,
      contactEmail: updated.email,
      country: updated.countryCode.toUpperCase(),
      planId: updated.plan,
    };

    const saved = await firstValueFrom(
      this.http.put<ApiCustomer>(
        `${this.apiBaseUrl}/customers/${updated.id}`,
        payload,
      ),
    );

    const mapped = this.mapApiCustomerToUi(saved);
    this.clients.update((list) =>
      list.map((client) => (client.id === mapped.id ? mapped : client)),
    );

    if (this.selectedClient()?.id === mapped.id) {
      await this.loadCustomerDetail(mapped.id);
    }

    this.showEditClientModal.set(false);
  }

  async deleteClient(id: string): Promise<void> {
    await firstValueFrom(
      this.http.delete<void>(`${this.apiBaseUrl}/customers/${id}`),
    );

    this.clients.update((list) => list.filter((client) => client.id !== id));
    if (this.selectedClient()?.id === id) {
      this.selectedClient.set(null);
      this.currentView.set("clientes");
    }
  }

  // Cost Progressive Calculation
  calculateCost(users: number): number {
    let total = 0;
    let remaining = users;

    const activeTiers = [...this.tiers()].sort((a, b) => {
      if (a.limit === null) return 1;
      if (b.limit === null) return -1;
      return a.limit - b.limit;
    });

    let prevLimit = 0;
    for (const tier of activeTiers) {
      if (tier.limit === null) {
        total += remaining * tier.price;
        break;
      } else {
        const tierRange = tier.limit - prevLimit;
        const usersInTier = Math.min(remaining, tierRange);
        total += usersInTier * tier.price;
        remaining -= usersInTier;
        prevLimit = tier.limit;
        if (remaining <= 0) break;
      }
    }

    return total;
  }

  // Total invoice calculation including country-specific tax
  calculateTotalCostWithTax(users: number, countryCode: string) {
    const subtotal = this.calculateCost(users);
    const taxObj = findTaxForCountry(this.taxes(), countryCode);
    const taxRate = taxObj ? taxObj.percentage : 21; // fallback to 21%
    const taxName = taxObj ? taxObj.taxName : "IVA";
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    return {
      subtotal,
      taxRate,
      taxName,
      taxAmount,
      total,
    };
  }

  // Adding Country Tax Settings
  async addTax(newTax: Tax): Promise<void> {
    const payload = {
      countryName: newTax.countryCode.toUpperCase(),
      taxName: newTax.taxName,
      percentage: newTax.percentage,
    };

    const created = await firstValueFrom(
      this.http.post<ApiTax>(`${this.apiBaseUrl}/impuestos`, payload),
    );

    const mapped = this.mapApiTaxToUi(created);
    this.taxes.update((list) => {
      const normalizedCountryCode = toCountryCode(mapped.countryCode);
      const existingIndex = list.findIndex(
        (tax) => toCountryCode(tax.countryCode) === normalizedCountryCode,
      );

      if (existingIndex === -1) {
        return [...list, mapped].sort((a, b) =>
          a.country.localeCompare(b.country),
        );
      }

      const next = [...list];
      next[existingIndex] = mapped;
      return next.sort((a, b) => a.country.localeCompare(b.country));
    });
    this.showAddTaxModal.set(false);
  }

  updateTaxPercentage(countryCode: string, percentage: number) {
    const normalizedCountryCode = toCountryCode(countryCode);
    this.taxes.update((list) =>
      list.map((t) =>
        toCountryCode(t.countryCode) === normalizedCountryCode
          ? { ...t, percentage }
          : t,
      ),
    );
  }

  async persistTax(tax: Tax): Promise<void> {
    if (tax.id === undefined) {
      const payload = {
        countryName: tax.countryCode.toUpperCase(),
        taxName: tax.taxName,
        percentage: tax.percentage,
      };

      const created = await firstValueFrom(
        this.http.post<ApiTax>(`${this.apiBaseUrl}/impuestos`, payload),
      );

      const mappedCreated = this.mapApiTaxToUi(created);
      this.taxes.update((list) =>
        list.map((entry) =>
          toCountryCode(entry.countryCode) ===
          toCountryCode(mappedCreated.countryCode)
            ? mappedCreated
            : entry,
        ),
      );

      return;
    }

    const payload = {
      countryName: tax.countryCode.toUpperCase(),
      taxName: tax.taxName,
      percentage: tax.percentage,
    };

    const updated = await firstValueFrom(
      this.http.put<ApiTax>(`${this.apiBaseUrl}/impuestos/${tax.id}`, payload),
    );

    const mapped = this.mapApiTaxToUi(updated);
    this.taxes.update((list) =>
      list.map((t) => (t.id === mapped.id ? mapped : t)),
    );
  }

  async deleteTaxById(id: number): Promise<void> {
    await firstValueFrom(
      this.http.delete<void>(`${this.apiBaseUrl}/impuestos/${id}`),
    );
    this.taxes.update((list) => list.filter((t) => t.id !== id));
  }

  // Managing Pricing Tiers
  addTier(price: number, limit: number | null) {
    const nextId = Math.max(...this.tiers().map((t) => t.id), 0) + 1;
    const nextLevel = Math.max(...this.tiers().map((t) => t.level), 0) + 1;
    const newTier: Tier = { id: nextId, level: nextLevel, limit, price };
    this.tiers.update((list) => [...list, newTier]);
  }

  updateTier(id: number, limit: number | null, price: number) {
    this.tiers.update((list) =>
      list.map((t) => (t.id === id ? { ...t, limit, price } : t)),
    );
  }

  deleteTier(id: number) {
    this.tiers.update((list) => list.filter((t) => t.id !== id));
  }

  public async loadCurrentUserProfile(): Promise<void> {
    const userId = this.currentUserId();

    if (userId === null) {
      throw new Error("No hay sesion iniciada.");
    }

    const currentUser = await firstValueFrom(
      this.http.get<ApiUser>(`${this.apiBaseUrl}/users/${userId}`),
    );
    this.userProfile.set(this.mapApiUserToProfile(currentUser));
    this.currentUserRole.set(currentUser.rol);
  }

  public async loadUsers(): Promise<void> {
    const users = await firstValueFrom(
      this.http.get<ApiUser[]>(`${this.apiBaseUrl}/users`),
    );
    this.users.set(users);
  }

  public async createUser(input: {
    nombre: string;
    apellido: string;
    email: string;
    contrasena: string;
    rol: UserRole;
  }): Promise<void> {
    if (!this.currentUserIsAdmin()) {
      throw new Error("Solo los administradores pueden crear usuarios nuevos.");
    }

    await firstValueFrom(
      this.http.post<ApiUser>(
        `${this.apiBaseUrl}/users`,
        {
          nombre: input.nombre,
          apellido: input.apellido,
          email: input.email,
          contrasena: input.contrasena,
          rol: input.rol,
        },
        { headers: this.getAuthenticatedHeaders() },
      ),
    );

    await this.loadUsers();
    this.showAddUserModal.set(false);
    this.activeEditUser.set(null);
  }

  public async updateUser(input: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    rol: UserRole;
    contrasena?: string;
  }): Promise<void> {
    if (!this.currentUserIsAdmin()) {
      throw new Error("Solo los administradores pueden actualizar usuarios.");
    }

    const payload: {
      nombre: string;
      apellido: string;
      email: string;
      rol: UserRole;
      contrasena?: string;
    } = {
      nombre: input.nombre,
      apellido: input.apellido,
      email: input.email,
      rol: input.rol,
    };

    const trimmedPassword = input.contrasena?.trim();
    if (trimmedPassword) {
      payload.contrasena = trimmedPassword;
    }

    await firstValueFrom(
      this.http.put<ApiUser>(`${this.apiBaseUrl}/users/${input.id}`, payload, {
        headers: this.getAuthenticatedHeaders(),
      }),
    );

    await this.loadUsers();
    this.showAddUserModal.set(false);
    this.activeEditUser.set(null);
  }

  public async deleteUserById(userId: number): Promise<void> {
    if (!this.currentUserIsAdmin()) {
      throw new Error("Solo los administradores pueden eliminar usuarios.");
    }

    await firstValueFrom(
      this.http.delete<void>(`${this.apiBaseUrl}/users/${userId}`, {
        headers: this.getAuthenticatedHeaders(),
      }),
    );

    await this.loadUsers();

    if (this.currentUserId() === userId) {
      this.logout();
    }
  }

  public async login(email: string, password: string): Promise<void> {
    const payload: ApiLoginPayload = {
      email: email.trim().toLowerCase(),
      contrasena: password,
    };

    const user = await firstValueFrom(
      this.http.post<ApiUser>(`${this.apiBaseUrl}/users/login`, payload),
    );

    this.currentUserId.set(user.id);
    this.currentUserRole.set(user.rol);
    this.userProfile.set(this.mapApiUserToProfile(user));
    this.isAuthenticated.set(true);
    this.persistSession();

    await this.bootstrapAuthenticatedData();
  }

  public logout(): void {
    this.isAuthenticated.set(false);
    this.currentUserId.set(null);
    this.currentUserRole.set(null);
    this.userProfile.set({
      name: "",
      surname: "",
      email: "",
      role: "usuario",
    });
    this.selectedClient.set(null);
    this.activeEditClient.set(null);
    this.activeEditUser.set(null);
    this.activeEditQuote.set(null);
    this.activeEditQuoteCustomerId.set(null);
    this.currentView.set("dashboard");
    this.currentSettingsTab.set("perfil");
    this.showAddClientModal.set(false);
    this.showEditClientModal.set(false);
    this.showAddTaxModal.set(false);
    this.showAddUserModal.set(false);
    this.users.set([]);
    this.persistSession();
  }

  public async updateCurrentUserProfile(input: {
    name: string;
    surname: string;
    email: string;
  }): Promise<void> {
    const userId = this.currentUserId();

    if (userId === null) {
      throw new Error("No hay un usuario seleccionado para actualizar.");
    }

    const updated = await firstValueFrom(
      this.http.put<ApiUser>(`${this.apiBaseUrl}/users/${userId}`, {
        nombre: input.name,
        apellido: input.surname,
        email: input.email,
      }),
    );

    this.userProfile.set(this.mapApiUserToProfile(updated));
  }

  public async updateCurrentUserPassword(newPassword: string): Promise<void> {
    const userId = this.currentUserId();

    if (userId === null) {
      throw new Error(
        "No hay un usuario seleccionado para actualizar la contrasena.",
      );
    }

    await firstValueFrom(
      this.http.put<ApiUser>(`${this.apiBaseUrl}/users/${userId}`, {
        contrasena: newPassword,
      }),
    );
  }

  public async deleteCurrentUserAccount(): Promise<void> {
    const userId = this.currentUserId();

    if (userId === null) {
      throw new Error("No hay un usuario seleccionado para eliminar.");
    }

    await firstValueFrom(
      this.http.delete<void>(`${this.apiBaseUrl}/users/${userId}`),
    );

    this.currentUserId.set(null);
    this.userProfile.set({
      name: "",
      surname: "",
      email: "",
      role: "usuario",
    });
    this.currentUserRole.set(null);
    this.users.set([]);
    this.isAuthenticated.set(false);
    this.persistSession();
  }
}
