import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Saas } from "../saas";
import { ButtonTertiary } from "../components/buttons/button-tertiary";
import { ButtonPrimary } from "../components/buttons/button-primary";
import { CustomerCard } from "../components/customer-card";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-dashboard",
  imports: [CommonModule, ButtonTertiary, ButtonPrimary, CustomerCard],
  template: `
    <!-- Page Content -->
    <main class="flex-1 overflow-y-auto p-6 md:p-8 relative bg-background">
      <!-- Subtle background grid -->
      <div class="absolute inset-0 z-0 pointer-events-none opacity-20"></div>

      <div class="max-w-7xl mx-auto relative z-10">
        <!-- Header Section -->
        <section
          class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <h2
              class="text-3xl font-headline font-bold tracking-tight text-on-surface mb-4"
            >
              ¿Qué quieres hacer?
            </h2>
            <p class="text-on-surface-variant font-body">
              Resumen general y accesos rápidos.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <app-button-tertiary
              [fullWidth]="true"
              (pressed)="saas.showAddClientModal.set(true)"
            />
            <app-button-primary
              [fullWidth]="true"
              [label]="'Nuevo presupuesto'"
              [icon]="'add'"
              [iconClass]="'text-[18px]'"
              [labelClass]="'text-sm font-semibold'"
              [reversed]="false"
              (pressed)="saas.currentView.set('presupuesto')"
            />
          </div>
        </section>

        <!-- Search Section -->
        <section class="mb-12">
          <div class="relative max-w-7xl">
            <div
              class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
            >
              <span class="material-symbols-outlined text-on-surface-variant"
                >search</span
              >
            </div>
            <input
              #searchInput
              type="text"
              [value]="clientsSearchQuery()"
              (input)="clientsSearchQuery.set($any($event.target).value)"
              class="w-full bg-surface-container border border-outline-variant text-on-surface text-base rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary focus:ring-offset-2 focus:ring-offset-background transition-all placeholder:text-on-surface-variant font-body"
              placeholder="Buscar empresa por nombre o DNI/NIF/CIF (ej. B12345678)..."
            />
            @if (clientsSearchQuery().trim()) {
              <div class="absolute inset-y-0 right-0 pr-2 flex items-center">
                <button
                  type="button"
                  (click)="clearSearch(searchInput)"
                  class="material-symbols-outlined text-on-surface-variant bg-surface-container-high px-2 py-1 rounded border border-outline-variant text-[18px] hover:bg-surface-container-highest transition-colors cursor-pointer"
                  aria-label="Limpiar búsqueda"
                >
                  close
                </button>
              </div>
            }
          </div>
        </section>

        <!-- Recent Clients Grid -->
        <section>
          <div class="flex items-center justify-between mb-6">
            <h3
              class="text-xl font-headline font-semibold tracking-tight text-on-surface"
            >
              Clientes Recientes
            </h3>
            <app-button-tertiary
              [fullWidth]="false"
              (pressed)="saas.currentView.set('clientes')"
              [buttonColorClass]="true"
              [icon]="'arrow_forward'"
              [label]="'Ver todos'"
              [reversed]="true"
              [iconClass]="'text-[18px]'"
              [labelClass]="'text-sm font-semibold'"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (client of recentClients(); track client.id) {
              <app-customer-card [client]="client"></app-customer-card>
            } @empty {
              <div
                class="col-span-full py-12 text-center text-on-surface-variant"
              >
                No se encontraron clientes recientes que coincidan con tu
                búsqueda.
              </div>
            }
          </div>
        </section>
      </div>
    </main>
  `,
})
export class Dashboard {
  saas = inject(Saas);

  clientsSearchQuery = signal("");

  recentClients = computed(() => {
    const query = this.clientsSearchQuery().toLowerCase().trim();
    const list = this.saas.clients();
    const filtered = list.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.cif.toLowerCase().includes(query),
    );
    return filtered.slice(0, 3);
  });

  clearSearch(input: HTMLInputElement): void {
    this.clientsSearchQuery.set("");
    input.focus();
  }

  getInitials(name: string): string {
    if (!name) return "";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
}
