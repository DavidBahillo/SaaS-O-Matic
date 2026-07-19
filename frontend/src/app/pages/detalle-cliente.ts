import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Saas, Customer, Quote } from "../saas";
import { ButtonTertiary } from "../components/buttons/button-tertiary";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-detalle-cliente",
  imports: [CommonModule, ButtonTertiary],
  template: `
    <!-- Page Content -->
    <main class="flex-1 overflow-y-auto p-6 md:p-8 bg-background">
      <div class="max-w-7xl mx-auto space-y-8">
        <!--  Breadcrumb & Header
        <div class="flex items-center justify-between pb-4 border-b border-outline-variant/50">
          <div class="flex items-center gap-2 text-sm text-on-surface-variant font-body">
            <button (click)="saas.currentView.set('clientes')" class="hover:text-on-surface transition-colors cursor-pointer">Clientes</button>
            <span class="material-symbols-outlined text-[16px]">chevron_right</span>
            <span class="text-on-surface font-medium">{{ client()?.name }}</span>
          </div> -->
        <!-- <div class="flex gap-3">
            <button (click)="openEditModal()" class="px-4 py-2 border border-outline-variant hover:bg-surface-container rounded-lg text-sm font-bold text-on-surface cursor-pointer transition-colors flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px]">edit</span>
              Editar
            </button>
            <button (click)="generateInvoice()" class="px-4 py-2 bg-primary hover:bg-primary-fixed-dim text-on-primary rounded-lg text-sm font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(167,139,250,0.15)]">
              <span class="material-symbols-outlined text-[18px]">receipt</span>
              Generar Factura
            </button>
          </div> 
        </div> -->

        <!-- Customer Identity Banner
        <div class="space-y-2">
          <h3 class="text-3xl font-black tracking-tight text-on-surface font-headline">{{ client()?.name }}</h3>
          <p class="text-on-surface-variant font-body text-sm">Cliente desde {{ client()?.createdDate || 'Enero 2024' }} • Sector {{ client()?.sector || 'Tecnológico' }}</p>
        </div> -->

        <!-- Metrics Row 
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-surface-container p-6 rounded-xl border border-outline-variant">
            <p class="text-xs text-on-surface-variant uppercase tracking-widest mb-1 font-semibold">Ingresos Totales</p>
            <p class="text-2xl font-bold text-on-surface font-mono">{{ client()?.totalRevenue | currency:'EUR':'symbol':'1.2-2':'es' }}</p>
          </div>
          <div class="bg-surface-container p-6 rounded-xl border border-outline-variant">
            <p class="text-xs text-on-surface-variant uppercase tracking-widest mb-1 font-semibold">Plan Actual</p>
            <p class="text-2xl font-bold text-tertiary">{{ client()?.plan }}</p>
          </div>
          <div class="bg-surface-container p-6 rounded-xl border border-outline-variant">
            <p class="text-xs text-on-surface-variant uppercase tracking-widest mb-1 font-semibold">Estado de Cuenta</p>
            <div class="flex items-center gap-2 mt-1">
              <span class="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse"></span>
              <span class="text-2xl font-bold text-on-surface">Activo</span>
            </div>
          </div>
        </div>-->

        <!-- Bento Grid Layout: 2 Columns -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- Left Column: Contact and Profile details (col-span-4) -->
          <div class="lg:col-span-4 flex flex-col gap-6">
            <div
              class="bg-surface-container border border-outline-variant rounded-xl p-6 relative overflow-hidden"
            >
              <!-- Subtle background glow -->
              <div
                class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"
              ></div>
                <div class="space-y-6 relative z-10 font-body">
                  <div class="flex items-center justify-between gap-3  mb-2">
                  <span
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-tertiary-container/20 text-tertiary border border-tertiary/20"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    {{ client()?.plan }}
                  </span>

                  <app-button-tertiary
                  (pressed)="openEditModal()"
                  [label]="'Editar cliente'"
                  [icon]="'edit'"
                  [labelClass]="'text-sm font-medium'"
                  [iconClass]="'text-[16px]!'"
                /></div>
                    <p class="text-xl font-medium text-on-surface">
                      {{ client()?.name }}
                    </p>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs text-on-surface-variant">CIF</p>
                    <p class="text-lg text-on-surface font-mono">
                      {{ client()?.cif }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-on-surface-variant">País</p>
                      <p class="text-lg text-on-surface">
                        {{ client()?.country }}
                      </p>
                  </div>
                </div>

                <div>
                  <p class="text-xs text-on-surface-variant">Email</p>
                  <p class="text-lg text-on-surface font-mono">
                    {{ client()?.email }}
                  </p>
                </div>
              </div>

              <div class="mt-5 relative z-10">
                @if (!confirmDelete()) {
                  <button
                    (click)="confirmDelete.set(true); deleteError.set('')"
                    class="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-error text-error text-sm font-medium hover:bg-error/10 transition-colors cursor-pointer"
                  >
                    <span class="material-symbols-outlined text-[16px]!"
                      >delete</span
                    >
                    Borrar Cliente
                  </button>
                } @else {
                  <div class="space-y-2">
                    <p class="text-xs text-error font-body">
                      ¿Seguro que quieres eliminar este cliente?
                    </p>
                    <div class="flex gap-2">
                      <button
                        (click)="deleteClient()"
                        class="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-error text-white text-xs font-semibold hover:opacity-90 transition-colors cursor-pointer"
                      >
                        Confirmar
                      </button>
                      <button
                        (click)="confirmDelete.set(false); deleteError.set('')"
                        class="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg border border-outline-variant text-on-surface text-xs font-medium hover:bg-surface-container-high transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                }

                @if (deleteError()) {
                  <p class="mt-2 text-xs text-error font-body">{{ deleteError() }}</p>
                }
              </div>
            </div>
          </div>

          <!-- Right Column: Historical lists (col-span-8) -->
          <div class="lg:col-span-8 space-y-8">
            <!-- Saved Quotes / Presupuestos Guardados -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <h3
                  class="font-headline font-semibold text-xl text-on-surface tracking-tight"
                >
                  Presupuestos Guardados
                </h3>
                <app-button-tertiary
                  (pressed)="newQuote()"
                  [label]="'Simular Nuevo'"
                  [icon]="'add_circle'"
                  [buttonColorClass]="true"
                />
              </div>

              <div
                class="bg-surface-container border border-outline-variant rounded-xl overflow-hidden"
              >
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-sm whitespace-nowrap">
                    <thead
                      class="bg-surface-container-high border-b border-outline-variant text-xs text-on-surface-variant font-medium tracking-wider"
                    >
                      <tr>
                        <th scope="col" class="px-6 py-4">Título</th>
                        <th scope="col" class="px-6 py-4">Usuarios</th>
                        <th scope="col" class="px-6 py-4">Coste</th>
                        <th scope="col" class="px-6 py-4">Divisa</th>
                        <th scope="col" class="px-6 py-4 text-right"></th>
                      </tr>
                    </thead>
                    <tbody
                      class="divide-y divide-outline-variant text-on-surface-variant font-body"
                    >
                      @for (quote of client()?.quotes; track quote.simulationId) {
                        <tr class="hover:bg-surface-container-high transition-colors group">
                          <td class="px-6 py-4 font-medium text-on-surface">
                            <div class="flex items-center gap-3">
                             
                              {{ quote.date }} - {{ quote.title }}
                            </div>
                          </td>
                          <td class="px-6 py-4">
                            <div class="flex items-center gap-2">
                              <span
                                class="material-symbols-outlined text-[16px] text-on-surface-variant"
                                >person</span
                              >
                              {{ quote.users }}
                            </div>
                          </td>
                      
                          <td class="px-6 py-4 font-mono text-on-surface">
                            {{ getQuoteDisplayCost(quote) }}
                          </td>
                          <td class="px-6 py-4">
                            <span
                              class="px-2 py-0.5 rounded bg-background border border-outline-variant text-xs"
                              >{{ quote.currency }}</span
                            >
                          </td>
                          <td class="px-6 py-4 text-right">
                           <div class="flex items-center justify-end gap-2">
                          <button
                            (click)="editQuote(quote)"
                            class="p-1.5 text-on-surface-variant hover:text-primary rounded hover:bg-surface-container-lowest transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <span class="material-symbols-outlined text-[18px]"
                              >edit</span
                            >
                          </button>
                          <button
                            (click)="deleteQuoteLine(quote)"
                            class="p-1.5 text-on-surface-variant hover:text-error rounded hover:bg-surface-container-lowest transition-colors cursor-pointer"
                            title="Eliminar"
                          >
                            <span class="material-symbols-outlined text-[18px]"
                              >delete</span
                            >
                          </button>
                        </div>
                          </td>
                        </tr>
                      } @empty {
                        <tr>
                          <td
                            colspan="5"
                            class="px-6 py-8 text-center text-on-surface-variant"
                          >
                            No hay simulaciones de presupuestos guardadas para
                            este cliente.
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </main>
  `,
})
export class DetalleCliente {
  saas = inject(Saas);
  confirmDelete = signal(false);
  deleteError = signal("");

  client = computed(() => this.saas.selectedClient());

  openEditModal() {
    const c = this.client();
    if (c) {
      this.saas.activeEditClient.set({ ...c });
      this.saas.showEditClientModal.set(true);
    }
  }

  generateInvoice() {
    const c = this.client();
    if (!c) return;

    // generate a new invoice dynamically for high fidelity!
    // const invoiceId = `#INV-2026-${Math.floor(100 + Math.random() * 900)}`;
    // const today = new Date();
    // const formattedDate = `${today.getDate().toString().padStart(2, "0")}/${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getFullYear()}`;
    const randomAmount = Math.floor(100 + Math.random() * 50) * 10;

    // const newInvoice = {
    //   id: invoiceId,
    //   date: formattedDate,
    //   amount: randomAmount,
    //   status: "PAGADO" as const,
    // };

    const updatedClient: Customer = {
      ...c,
      totalRevenue: c.totalRevenue + randomAmount,
      // billingHistory: [newInvoice, ...c.billingHistory],
    };

    this.saas.updateClient(updatedClient);
  }

  newQuote() {
    this.saas.clearQuoteEdition();
    this.saas.currentView.set("presupuesto");
  }

  editQuote(quote: Quote) {
    const customerId = this.client()?.id;
    if (!customerId) return;

    this.saas.startQuoteEdition(quote, customerId);
    this.saas.currentView.set("presupuesto");
  }

  async deleteQuoteLine(quote: Quote): Promise<void> {
    const customerId = this.client()?.id;
    if (!customerId) return;

    await this.saas.deleteSimulation(quote.simulationId, customerId);
  }

  getQuoteDisplayCost(quote: Quote): string {
    const converted = this.saas.convertFromEur(quote.totalCost, quote.currency);
    return this.saas.formatCurrency(converted, quote.currency);
  }

  async deleteClient(): Promise<void> {
    const c = this.client();
    if (!c) return;

    this.deleteError.set("");

    try {
      await this.saas.deleteClient(c.id);
      this.confirmDelete.set(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo borrar el cliente.';
      this.deleteError.set(message);
    }
  }
}
