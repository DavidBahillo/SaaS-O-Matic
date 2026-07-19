import {ChangeDetectionStrategy, Component, inject, signal, computed} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Saas} from '../saas';
import {ButtonPrimary} from '../components/buttons/button-primary';
import {CustomerCard} from '../components/customer-card';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-clientes',
  imports: [CommonModule, ButtonPrimary, CustomerCard],
  template: `
    <!-- Page Content -->
    <main class="flex-1 overflow-y-auto p-6 md:p-8 relative bg-background">
      <!-- Subtle background grid -->
      <div class="absolute inset-0 z-0 pointer-events-none opacity-20" ></div>
      
      <div class="max-w-7xl mx-auto relative z-10">
        <!-- Header & Search Section -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div class="w-full md:w-1/2">
            <h2 class="text-3xl font-headline font-bold tracking-tight text-on-surface mb-4">Todos los Clientes</h2>
            <div class="relative group">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
              <input 
                #searchInput
                type="text" 
                [value]="searchQuery()" 
                (input)="searchQuery.set($any($event.target).value); currentPage.set(1)"
                class="w-full bg-surface-container border border-outline-variant rounded-lg py-2.5 pl-10 pr-14 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow text-sm font-body" 
                placeholder="Buscar empresa por nombre o DNI/NIF/CIF (ej. B12345678)..."
              />
              @if (searchQuery().trim()) {
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
          </div>
          
          <div class="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto md:flex-nowrap">
            <!-- Filter Dropdown Triggered by Button -->
            <div class="relative w-full sm:flex-1 md:w-64 md:flex-none">
              <select 
                [value]="selectedPlanFilter()" 
                (change)="selectedPlanFilter.set($any($event.target).value); currentPage.set(1)"
                class="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer appearance-none pr-10"
              >
                <option value="Todos">Todos los Planes</option>
                <option value="Plan Starter">Plan Starter</option>
                <option value="Plan Pro">Plan Pro</option>
                <option value="Plan Enterprise">Plan Enterprise</option>
              </select>
              <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
            <div class="w-full sm:w-auto md:shrink-0">
              <app-button-primary
                [label]="'Nuevo Cliente'"
                [icon]="'add'"
                [fullWidth]="true"
                [iconClass]="'text-[18px]'"
                [labelClass]="'text-sm font-semibold'"
                [reversed]="false"
                (pressed)="saas.showAddClientModal.set(true)"
              />
            </div>
          </div>
        </div>

        <!-- Customers Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
          @for (client of paginatedClients(); track client.id) {
            <app-customer-card [client]="client"></app-customer-card>
            
          } @empty {
            <div class="col-span-full py-16 text-center text-on-surface-variant bg-surface-container border border-outline-variant rounded-lg">
              <span class="material-symbols-outlined text-4xl mb-2 text-outline">group_off</span>
              <p>No se encontraron clientes que coincidan con la búsqueda.</p>
            </div>
          }
        </div>

        <!-- Pagination -->
        @if (totalFilteredCount() > 0) {
          <div class="flex items-center justify-between border-t border-outline-variant pt-5">
            <p class="text-sm text-on-surface-variant hidden sm:block font-body">
              Mostrando <span class="font-medium text-on-surface">{{ displayStart() }}</span> a <span class="font-medium text-on-surface">{{ displayEnd() }}</span> de <span class="font-medium text-on-surface">{{ totalFilteredCount() }}</span> clientes
            </p>
            
            <nav class="flex items-center gap-1 w-full sm:w-auto justify-center sm:justify-end">
              <!-- Previous Page -->
              <button 
                [disabled]="currentPage() === 1"
                (click)="prevPage()"
                class="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <span class="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              
              <!-- Page indicators -->
              <div class="flex items-center gap-1">
                @for (p of pages(); track p) {
                  <button 
                    (click)="currentPage.set(p)"
                    [class]="p === currentPage() ? 'w-8 h-8 flex items-center justify-center rounded-md bg-primary-container text-primary-fixed font-medium text-sm border border-primary/20' : 'w-8 h-8 flex items-center justify-center rounded-md text-on-surface hover:bg-surface-container font-medium text-sm transition-colors border border-transparent hover:border-outline-variant cursor-pointer'"
                  >
                    {{ p }}
                  </button>
                }
              </div>
              
              <!-- Next Page -->
              <button 
                [disabled]="currentPage() === totalPages()"
                (click)="nextPage()"
                class="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <span class="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </nav>
          </div>
        }
      </div>
    </main>
  `,
})
export class Clientes {
  saas = inject(Saas);

  searchQuery = signal('');
  selectedPlanFilter = signal<string>('Todos');
  currentPage = signal(1);
  itemsPerPage = 6;

  filteredClients = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const filter = this.selectedPlanFilter();
    let list = this.saas.clients();

    if (filter !== 'Todos') {
      list = list.filter(c => c.plan === filter);
    }

    if (q) {
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.cif.toLowerCase().includes(q));
    }

    return list;
  });

  totalFilteredCount = computed(() => this.filteredClients().length);

  totalPages = computed(() => {
    return Math.ceil(this.totalFilteredCount() / this.itemsPerPage) || 1;
  });

  pages = computed(() => {
    const total = this.totalPages();
    const arr = [];
    for (let i = 1; i <= total; i++) arr.push(i);
    return arr;
  });

  paginatedClients = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredClients().slice(start, end);
  });

  displayStart = computed(() => {
    if (this.totalFilteredCount() === 0) return 0;
    return (this.currentPage() - 1) * this.itemsPerPage + 1;
  });

  displayEnd = computed(() => {
    const calculatedEnd = this.currentPage() * this.itemsPerPage;
    return Math.min(calculatedEnd, this.totalFilteredCount());
  });

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  clearSearch(input: HTMLInputElement): void {
    this.searchQuery.set('');
    this.currentPage.set(1);
    input.focus();
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
}
