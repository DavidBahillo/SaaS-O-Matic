import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Saas } from "../saas";
import { ButtonSecondary } from "../components/buttons/button-secondary";
import { ButtonPrimary } from "../components/buttons/button-primary";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-presupuesto",
  imports: [CommonModule, ButtonSecondary, ButtonPrimary],
  template: `
    <main class="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 bg-background">
      <div class="max-w-7xl mx-auto space-y-8">
        <div class="space-y-2">
          <h2
            class="text-3xl font-headline font-semibold tracking-tight text-on-surface"
          >
            Calculadora de Presupuesto
          </h2>
          <p class="text-on-surface-variant font-body text-base max-w-2xl">
            Simula costes mensuales y genera propuestas comerciales al instante
            basadas en el volumen de usuarios.
          </p>
        </div>

        @if (feedbackMessage()) {
          <div
            [class]="
              feedbackType() === 'error'
                ? 'p-4 rounded-lg bg-error/10 border border-error/30 text-error flex items-center gap-2 font-body text-sm'
                : feedbackType() === 'info'
                  ? 'p-4 rounded-lg bg-primary/10 border border-primary/30 text-primary flex items-center gap-2 font-body text-sm'
                  : 'p-4 rounded-lg bg-tertiary-container/20 border border-tertiary/30 text-tertiary flex items-center gap-2 font-body text-sm'
            "
          >
            <span class="material-symbols-outlined">
              {{
                feedbackType() === "error"
                  ? "error"
                  : feedbackType() === "info"
                    ? "info"
                    : "check_circle"
              }}
            </span>
            {{ feedbackMessage() }}
          </div>
        }

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <div
              class="bg-surface-container-high border border-outline-variant rounded-xl p-6 shadow-sm"
            >
              <div class="mb-6">
                <label
                  class="block text-sm font-medium text-on-surface mb-3 font-body"
                  for="quote-title-input"
                >
                  Título del Presupuesto
                </label>
                <input
                  id="quote-title-input"
                  type="text"
                  [value]="quoteTitle()"
                  (input)="quoteTitle.set($any($event.target).value)"
                  class="bg-surface border border-outline-variant text-on-surface text-sm rounded-lg block w-full p-2.5 transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Ej. Presupuesto Q4 - Cliente X"
                />
              </div>

              <div class="mb-2">
                <label
                  class="block text-sm font-medium text-on-surface mb-3 font-body"
                  for="client-select-input"
                >
                  Cliente
                </label>
                <div class="relative">
                  <select
                    id="client-select-input"
                    [value]="currentClientId()"
                    (change)="onClientChange($any($event.target).value)"
                    class="bg-surface border border-outline-variant text-on-surface text-sm rounded-lg block w-full p-2.5 transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer appearance-none pr-10"
                  >
                    <option value="" [selected]="currentClientId() === ''">
                      -- Selecciona un cliente --
                    </option>
                    @for (c of saas.clients(); track c.id) {
                      <option
                        [value]="c.id"
                        [selected]="currentClientId() === c.id"
                      >
                        {{ c.name }} ({{ c.country }})
                      </option>
                    }
                  </select>
                  <span
                    class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                  >
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            <div
              class="bg-surface-container-high border border-outline-variant rounded-xl p-6 shadow-sm"
            >
              <div class="flex justify-between items-end mb-6 font-body">
                <div>
                  <h3 class="text-lg font-medium text-on-surface">
                    Número de Usuarios Activos
                  </h3>
                  <p class="text-sm text-on-surface-variant mt-1">
                    El coste base escala automáticamente según los tramos de
                    usuarios.
                  </p>
                </div>
                <div
                  class="bg-surface border border-outline-variant px-3 py-2 rounded-lg"
                >
                  <input
                    type="number"
                    min="1"
                    step="1"
                    [value]="users()"
                    (input)="onUsersInput($any($event.target).value)"
                    class="w-24 bg-transparent text-2xl font-bold text-primary font-mono outline-none"
                    aria-label="Usuarios activos"
                  />
                </div>
              </div>

              <div class="relative pt-4 pb-2">
                <input
                  type="range"
                  min="1"
                  [max]="sliderMaxUsers()"
                  [value]="users()"
                  (input)="onUsersInput($any($event.target).value)"
                  class="w-full h-2 bg-surface border border-outline-variant rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div
                  class="flex justify-between text-xs text-on-surface-variant mt-4 font-mono"
                >
                  <span>1</span>
                  <span>50</span>
                  <span>100</span>
                  <span>150</span>
                  <span>200+</span>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-1 space-y-6 font-body">
            <div
              class="bg-surface-container-high border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col h-full relative overflow-hidden"
            >
              <div
                class="absolute -top-24 -right-24 w-48 h-48 bg-primary rounded-full mix-blend-screen filter blur-[80px] opacity-10"
              ></div>

              <h3
                class="text-sm font-medium text-on-surface-variant mb-6 flex items-center gap-2 uppercase tracking-wider"
              >
                <span class="material-symbols-outlined text-[18px]"
                  >receipt_long</span
                >
                Resumen Financiero
              </h3>

              <div class="space-y-6 flex-1">
                <div
                  class="flex flex-col gap-1 pb-4 border-b border-outline-variant"
                >
                  <span class="text-sm text-on-surface-variant"
                    >Coste Base Mensual</span
                  >
                  <div class="flex items-baseline gap-1">
                    <span class="text-xl font-medium text-on-surface font-mono">
                      {{ formatMoney(convertedSubtotal(), currencyCode()) }}
                    </span>
                    <span class="text-xs text-on-surface-variant">/mes</span>
                  </div>
                </div>

                <div class="flex flex-col gap-2 pt-2">
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-on-surface"
                      >Total Factura</span
                    >
                    <div class="relative inline-block w-20">
                      <select
                        [value]="currencyCode()"
                        (change)="currencyCode.set($any($event.target).value)"
                        class="block w-full appearance-none bg-surface border border-outline-variant text-on-surface-variant py-1 px-2 pr-6 rounded text-xs leading-tight focus:outline-none focus:border-primary transition-colors cursor-pointer"
                      >
                        @for (code of availableCurrencies(); track code) {
                          <option
                            [value]="code"
                            [selected]="currencyCode() === code"
                          >
                            {{ code }}
                          </option>
                        }
                      </select>
                      <div
                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-on-surface-variant"
                      >
                        <span class="material-symbols-outlined text-[14px]"
                          >expand_more</span
                        >
                      </div>
                    </div>
                  </div>

                  <span class="text-xs text-on-surface-variant -mt-1 font-mono">
                    (incl. {{ taxName() }} {{ taxRate() }}%)
                  </span>

                  <span class="text-xs text-on-surface-variant font-mono">
                    @if (saas.exchangeRatesLoading()) {
                      Actualizando tipo de cambio...
                    } @else {
                      1 EUR =
                      {{ saas.getExchangeRate(currencyCode()).toFixed(4) }}
                      {{ currencyCode() }}
                    }
                  </span>

                  <div class="mt-2 flex items-baseline gap-1">
                    <span
                      class="text-4xl font-bold tracking-tight text-primary font-mono"
                    >
                      {{ formatMoney(convertedTotal(), currencyCode()) }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-3 mt-8">
                <app-button-secondary
                  (pressed)="saveQuote()"
                  [disabled]="!selectedClient()"
                  [label]="
                    editingQuote()
                      ? 'Actualizar presupuesto'
                      : 'Guardar presupuesto'
                  "
                  [fullWidth]="true"
                  [icon]="''"
                  [borderColorClass]="true"
                />
                <app-button-primary
                  [disabled]="!selectedClient()"
                  [label]="
                    editingQuote()
                      ? 'Actualizar y generar PDF'
                      : 'Guardar y generar PDF'
                  "
                  [icon]="'picture_as_pdf'"
                  [fullWidth]="true"
                  [iconClass]="'text-[18px]'"
                  [labelClass]="'text-sm font-semibold'"
                  (pressed)="saveQuoteAndGeneratePdf()"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `,
})
export class Presupuesto {
  saas = inject(Saas);
  private cdr = inject(ChangeDetectorRef);

  quoteTitle = signal("Presupuesto Q4 - Simulación");
  selectedClientId = signal<string>("");
  users = signal<number>(45);
  currencyCode = signal<string>("EUR");
  feedbackMessage = signal<string>("");
  feedbackType = signal<"success" | "error" | "info">("success");
  editingQuoteClientId = signal<string>(""); // Track the client ID when editing a quote

  private readonly defaultQuoteTitle = "Presupuesto Q4 - Simulación";

  currentClientId = computed(() => {
    // If editing a quote, use the dedicated signal
    const editingId = this.editingQuoteClientId();
    if (editingId) {
      return editingId;
    }

    // Otherwise use the selected client ID or the current selected client
    return this.selectedClientId() || this.saas.selectedClient()?.id || "";
  });

  selectedClient = computed(() => {
    const id = this.currentClientId();
    return this.saas.clients().find((c) => c.id === id) || null;
  });

  countryCode = computed(() => {
    const client = this.selectedClient();
    return client ? client.countryCode : "es";
  });

  pricingBreakdown = computed(() => {
    return this.saas.calculateTotalCostWithTax(
      this.users(),
      this.countryCode(),
    );
  });

  subtotal = computed(() => this.pricingBreakdown().subtotal);
  taxRate = computed(() => this.pricingBreakdown().taxRate);
  taxName = computed(() => this.pricingBreakdown().taxName);
  totalCostEur = computed(() => this.pricingBreakdown().total);
  convertedSubtotal = computed(() =>
    this.saas.convertFromEur(this.subtotal(), this.currencyCode()),
  );
  convertedTotal = computed(() =>
    this.saas.convertFromEur(this.totalCostEur(), this.currencyCode()),
  );
  editingQuote = computed(() => this.saas.activeEditQuote());
  sliderMaxUsers = computed(() => Math.max(200, this.users()));
  availableCurrencies = computed(() => {
    const rates = this.saas.exchangeRates();
    const allCodes = Object.keys(rates)
      .map((code) => code.toUpperCase())
      .filter((code) => code.length === 3)
      .sort((a, b) => a.localeCompare(b));

    const prioritized = ["EUR", "USD", "GBP"];
    const merged = [
      ...prioritized.filter((code) => allCodes.includes(code)),
      ...allCodes.filter((code) => !prioritized.includes(code)),
    ];

    return merged.length > 0 ? merged : ["EUR", "USD", "GBP"];
  });

  public constructor() {
    void this.saas.loadExchangeRates();

    // Effect 1: Load quote data when editing
    effect(() => {
      const quote = this.saas.activeEditQuote();

      if (!quote) {
        this.editingQuoteClientId.set("");
        return;
      }

      const clientId = this.saas.activeEditQuoteCustomerId();

      // Set the editing quote's client ID
      if (clientId) {
        this.editingQuoteClientId.set(clientId);
        this.cdr.detectChanges(); // Force immediate change detection
      }

      // Load users
      this.users.set(quote.users);

      // Load currency from quote
      if (quote.currency && quote.currency.trim()) {
        const newCurrency = quote.currency.trim().toUpperCase();
        this.currencyCode.set(newCurrency);
        this.cdr.markForCheck();
      }

      // Load title
      const clientName = this.selectedClient()?.name || "Simulación";
      this.quoteTitle.set(
        quote.title?.trim() || `Presupuesto Q4 - ${clientName}`,
      );
    });

    // Effect 2: Auto-set currency when client is selected (only if not editing a quote)
    effect(() => {
      const quote = this.saas.activeEditQuote();
      const selectedClient = this.saas.selectedClient();
      const selectedClientId = String(selectedClient?.id ?? "");
      const alreadySelected = this.selectedClientId();

      if (quote || !selectedClient || !selectedClientId || alreadySelected) {
        return;
      }

      console.log(
        "Setting currency for new client:",
        selectedClient.countryCode,
      );
      this.selectedClientId.set(selectedClientId);
      this.quoteTitle.set(`Presupuesto Q4 - ${selectedClient.name}`);
      this.currencyCode.set(
        this.saas.getSuggestedCurrencyForCountry(selectedClient.countryCode),
      );
      this.cdr.markForCheck();
    });

    // Effect 3: Monitor currency changes
    effect(() => {
      const currency = this.currencyCode();
      console.log("Currency is now:", currency);
    });
  }

  onClientChange(id: string): void {
    // Don't process if we're editing a quote (preserve the quote's selection)
    if (this.editingQuoteClientId()) {
      console.log("⏭️  Ignoring client change because editing a quote");
      return;
    }

    if (this.saas.activeEditQuote()) {
      console.log(
        "⏭️  Ignoring client change because there is an active edit quote",
      );
      return;
    }

    // Only process if the ID actually changed and is not empty
    if (!id || id === this.selectedClientId()) {
      return;
    }

    console.log("Client changed to:", id);
    this.selectedClientId.set(id);
    this.saas.clearQuoteEdition();

    const client = this.saas.clients().find((c) => c.id === id);
    if (client) {
      this.quoteTitle.set(`Presupuesto Q4 - ${client.name}`);
      const autoCurrency = this.saas.getSuggestedCurrencyForCountry(
        client.countryCode,
      );
      console.log(
        "onClientChange: Setting currency to",
        autoCurrency,
        "for country",
        client.countryCode,
      );
      this.currencyCode.set(autoCurrency);
    }
  }

  onUsersInput(value: string): void {
    this.users.set(this.normalizeUsers(value));
  }

  async saveQuote(): Promise<void> {
    await this.persistQuote(false);
  }

  async saveQuoteAndGeneratePdf(): Promise<void> {
    await this.persistQuote(true);
  }

  private getTierBreakdownLines(): {
    level: number;
    rangeLabel: string;
    usersInTier: number;
    unitPriceEur: number;
    subtotalEur: number;
  }[] {
    const totalUsers = this.users();
    let remaining = totalUsers;
    let previousLimit = 0;

    const activeTiers = [...this.saas.tiers()].sort((a, b) => {
      if (a.limit === null) return 1;
      if (b.limit === null) return -1;
      return a.limit - b.limit;
    });

    const lines: {
      level: number;
      rangeLabel: string;
      usersInTier: number;
      unitPriceEur: number;
      subtotalEur: number;
    }[] = [];

    for (const tier of activeTiers) {
      if (remaining <= 0) {
        break;
      }

      const usersInTier =
        tier.limit === null
          ? remaining
          : Math.min(remaining, tier.limit - previousLimit);

      if (usersInTier <= 0) {
        if (tier.limit !== null) {
          previousLimit = tier.limit;
        }
        continue;
      }

      const rangeLabel =
        tier.limit === null
          ? `>${previousLimit}`
          : `${previousLimit + 1}-${tier.limit}`;

      lines.push({
        level: tier.level,
        rangeLabel,
        usersInTier,
        unitPriceEur: tier.price,
        subtotalEur: usersInTier * tier.price,
      });

      remaining -= usersInTier;
      if (tier.limit !== null) {
        previousLimit = tier.limit;
      }
    }

    return lines;
  }

  private async persistQuote(generatePdf: boolean): Promise<void> {
    const client = this.selectedClient();
    if (!client) {
      this.setInfoFeedback(
        "Por favor, selecciona un cliente para guardar el presupuesto.",
      );
      this.clearFeedback();
      return;
    }

    try {
      const editingQuote = this.editingQuote();

      if (editingQuote) {
        await this.saas.updateSimulation({
          simulationId: editingQuote.simulationId,
          customerId: client.id,
          budgetName: this.quoteTitle(),
          activeUsers: this.users(),
          currency: this.currencyCode(),
        });
      } else {
        await this.saas.createSimulation({
          customerId: client.id,
          budgetName: this.quoteTitle(),
          activeUsers: this.users(),
          currency: this.currencyCode(),
        });
      }

      if (generatePdf) {
        await this.downloadQuotePdf(client.name);
        this.setSuccessFeedback(
          editingQuote
            ? "Presupuesto actualizado y PDF descargado correctamente."
            : `Presupuesto guardado y PDF descargado para ${client.name} en ${this.currencyCode()}.`,
        );
      } else {
        this.setSuccessFeedback(
          editingQuote
            ? "Presupuesto actualizado correctamente."
            : `Presupuesto guardado correctamente para ${client.name} en ${this.currencyCode()}.`,
        );
      }

      const wasEditing = !!editingQuote;
      this.saas.clearQuoteEdition();
      this.clearFeedback();

      // Volver al detalle del cliente si veníamos de editar un presupuesto
      if (wasEditing) {
        await this.saas.selectClient(client);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo guardar el presupuesto.";
      this.setErrorFeedback(message);
      this.clearFeedback();
    }
  }

  private async downloadQuotePdf(clientName: string): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const breakdown = this.getTierBreakdownLines();
    const exchangeRate = this.saas.getExchangeRate(this.currencyCode());
    const taxAmount = this.convertedTotal() - this.convertedSubtotal();
    const now = new Date();
    const issueDate = now.toLocaleDateString("es-ES");

    const yStart = 20;
    doc.setFontSize(18);
    doc.text("Presupuesto SaaS-O-Matic", 14, yStart);

    doc.setFontSize(12);
    doc.text(`Fecha: ${issueDate}`, 14, yStart + 10);
    doc.text(`Cliente: ${clientName}`, 14, yStart + 18);
    doc.text(`Titulo: ${this.quoteTitle()}`, 14, yStart + 26);
    doc.text(`Usuarios activos: ${this.users()}`, 14, yStart + 34);
    doc.text(
      `Divisa: ${this.currencyCode()} (1 EUR = ${exchangeRate.toFixed(4)} ${this.currencyCode()})`,
      14,
      yStart + 42,
    );

    doc.setFontSize(13);
    doc.text("Desglose por tramos", 14, yStart + 54);

    doc.setFontSize(10);
    let rowY = yStart + 62;
    doc.text("Nivel", 14, rowY);
    doc.text("Rango", 34, rowY);
    doc.text("Usuarios", 66, rowY);
    doc.text("Precio/u", 96, rowY);
    doc.text("Subtotal", 146, rowY);
    rowY += 4;
    doc.line(14, rowY, 196, rowY);

    rowY += 6;
    breakdown.forEach((line) => {
      doc.text(String(line.level), 14, rowY);
      doc.text(line.rangeLabel, 34, rowY);
      doc.text(String(line.usersInTier), 66, rowY);
      doc.text(
        this.saas.formatCurrency(
          this.saas.convertFromEur(line.unitPriceEur, this.currencyCode()),
          this.currencyCode(),
        ),
        96,
        rowY,
      );
      doc.text(
        this.saas.formatCurrency(
          this.saas.convertFromEur(line.subtotalEur, this.currencyCode()),
          this.currencyCode(),
        ),
        146,
        rowY,
      );
      rowY += 6;
    });

    rowY += 2;
    doc.line(14, rowY, 196, rowY);
    rowY += 8;

    doc.setFontSize(12);
    doc.text(
      `Base imponible: ${this.formatMoney(this.convertedSubtotal(), this.currencyCode())}`,
      14,
      rowY,
    );
    rowY += 8;
    doc.text(
      `Impuesto (${this.taxName()} ${this.taxRate()}%): ${this.formatMoney(taxAmount, this.currencyCode())}`,
      14,
      rowY,
    );
    rowY += 10;

    doc.setFontSize(14);
    doc.text(
      `TOTAL: ${this.formatMoney(this.convertedTotal(), this.currencyCode())}`,
      14,
      rowY,
    );

    const safeName = clientName.replace(/[^a-zA-Z0-9_-]/g, "_");
    const blob = doc.output("blob");
    const url = window.URL.createObjectURL(blob);
    const link = window.document.createElement("a");
    link.href = url;
    link.download = `presupuesto_${safeName}_${Date.now()}.pdf`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  formatMoney(amount: number, currencyCode: string): string {
    return this.saas.formatCurrency(amount, currencyCode);
  }

  private normalizeUsers(value: string): number {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return 1;
    }

    return Math.max(1, parsed);
  }

  private setSuccessFeedback(message: string): void {
    this.feedbackType.set("success");
    this.feedbackMessage.set(message);
  }

  private setErrorFeedback(message: string): void {
    this.feedbackType.set("error");
    this.feedbackMessage.set(message);
  }

  private setInfoFeedback(message: string): void {
    this.feedbackType.set("info");
    this.feedbackMessage.set(message);
  }

  private clearFeedback(): void {
    setTimeout(() => {
      this.feedbackMessage.set("");
    }, 5000);
  }
}
