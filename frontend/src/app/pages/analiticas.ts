import {ChangeDetectionStrategy, Component, inject, computed, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Saas} from '../saas';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-analiticas',
  imports: [CommonModule],
  template: `
    <!-- Page Content -->
    <main class="flex-1 overflow-y-auto p-6 md:p-8 relative bg-background">
      <div class="max-w-7xl mx-auto relative z-10">
      <header class="mb-10">
        <h2 class="text-3xl font-headline font-bold tracking-tight text-on-surface">Analytics Overview</h2>
        <p class="text-on-surface-variant mt-2 text-sm">Monitoreo de suscripciones y demografía de clientes.</p>
      </header>

      <!-- Top Section: Subscription Levels (Bento/Card Grid) -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <!-- Plan Starter -->
        <div class="bg-surface-container border border-outline-variant rounded-xl p-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div class="absolute top-0 right-0 p-6 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
            <span class="material-symbols-outlined text-[100px]!   text-primary">rocket_launch</span>
          </div>
          <h3 class="text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-2">Plan Starter</h3>
          <div class="text-4xl font-headline font-bold text-on-surface mb-6">{{ starterCount() }}</div>
          <div class="space-y-2 font-body">
            <div class="flex justify-between text-xs text-on-surface-variant">
              <span>Distribución</span>
              <span class="text-on-surface font-medium">{{ starterPercentage() }}%</span>
            </div>
            <div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
              <div class="bg-primary h-full rounded-full transition-all duration-500" [style.width.%]="starterPercentage()"></div>
            </div>
          </div>
        </div>

        <!-- Plan Pro -->
        <div class="bg-surface-container border border-outline-variant rounded-xl p-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div class="absolute top-0 right-0 p-6 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
            <span class="material-symbols-outlined text-[100px]! text-primary">work</span>
          </div>
          <h3 class="text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-2">Plan Pro</h3>
          <div class="text-4xl font-headline font-bold text-on-surface mb-6">{{ proCount() }}</div>
          <div class="space-y-2 font-body">
            <div class="flex justify-between text-xs text-on-surface-variant">
              <span>Distribución</span>
              <span class="text-on-surface font-medium">{{ proPercentage() }}%</span>
            </div>
            <div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
              <div class="bg-primary-fixed-dim h-full rounded-full transition-all duration-500" [style.width.%]="proPercentage()"></div>
            </div>
          </div>
        </div>

        <!-- Plan Enterprise -->
        <div class="bg-surface-container border border-outline-variant rounded-xl p-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div class="absolute top-0 right-0 p-6 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
            <span class="material-symbols-outlined text-[100px]! text-primary">corporate_fare</span>
          </div>
          <h3 class="text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-2">Plan Enterprise</h3>
          <div class="text-4xl font-headline font-bold text-on-surface mb-6">{{ enterpriseCount() }}</div>
          <div class="space-y-2 font-body">
            <div class="flex justify-between text-xs text-on-surface-variant">
              <span>Distribución</span>
              <span class="text-on-surface font-medium">{{ enterprisePercentage() }}%</span>
            </div>
            <div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
              <div class="bg-outline h-full rounded-full transition-all duration-500" [style.width.%]="enterprisePercentage()"></div>
            </div>
          </div>
        </div>

      </section>

      <!-- Bottom Section: 50/50 Split -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Card 1: Ranking de clientes por país -->
        <div class="bg-surface-container border border-outline-variant rounded-xl p-6 flex flex-col">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-lg font-headline font-semibold text-on-surface">Ranking de clientes por país</h3>
          </div>
          
          <div class="space-y-6 grow">
            @for (stat of paginatedCountries(); track stat.country) {
              <div class="flex items-center gap-4">
                <!-- Check if we have pre-defined flags from mockup, else render a beautiful circle avatar -->
                @if (getFlagImage(stat.countryCode)) {
                  <img 
                    [src]="getFlagImage(stat.countryCode)" 
                    [alt]="stat.country" 
                    referrerpolicy="no-referrer"
                    class="w-7 h-7  rounded-full border border-outline-variant object-cover shrink-0"
                  />
                } @else {
                  <div class="min-w-8 h-8 px-2 rounded-full border border-outline-variant bg-surface-container-highest flex items-center justify-center text-[10px] font-mono font-bold text-on-surface shrink-0">
                    {{ stat.country }}
                  </div>
                }

                <div class="flex-1 font-body">
                  <div class="flex justify-between items-end mb-1 text-sm">
                    <span class="font-medium text-on-surface">{{ stat.country }}</span>
                    <span class="font-bold text-primary">{{ stat.count }}</span>
                  </div>
                  <div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div class="bg-primary h-full rounded-full transition-all duration-500" [style.width.%]="stat.percentage"></div>
                  </div>
                </div>
              </div>
            } @empty {
              <p class="text-center text-on-surface-variant py-12">No hay datos demográficos disponibles.</p>
            }
          </div>

          <!-- Pagination controls -->
          @if (totalPages() > 1) {
            <div class="flex items-center justify-between  pt-5">
              <p class="text-sm text-on-surface-variant hidden sm:block font-body">
                Mostrando <span class="font-medium text-on-surface">{{ displayStart() }}</span> a <span class="font-medium text-on-surface">{{ displayEnd() }}</span> de <span class="font-medium text-on-surface">{{ allCountries().length }}</span> países
              </p>
              
              <nav class="flex items-center gap-1 w-full sm:w-auto justify-center sm:justify-end">
                <!-- Previous Page -->
                <button 
                  [disabled]="currentPage() === 1"
                  (click)="previousPage()"
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

        <!-- Card 2: Clientes Totales -->
        <div class="bg-surface-container border border-outline-variant rounded-xl py-12 flex flex-col justify-start items-center text-center relative overflow-hidden min-h-75">
          <!-- Decorative background elements for high-end feel -->
          <div class="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent pointer-events-none"></div>
          <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <h3 class="text-lg font-headline font-semibold text-on-surface-variant mb-6 relative z-10">Clientes totales registrados</h3>
          <div class="flex items-baseline gap-2 relative z-10">
            <span class="text-7xl font-headline font-black text-on-surface tracking-tighter">{{ saas.totalClientsCount() }}</span>
          </div>

          <!-- Subtle dynamic graphical waves at bottom -->
          <div class="absolute bottom-0 left-0 w-full h-1/3 bg-linear-to-t from-surface-container-high/50 to-transparent flex items-end justify-between px-6 pb-4 opacity-50 pointer-events-none">
            <div class="w-1/6 h-4 bg-primary/20 rounded-t-sm"></div>
            <div class="w-1/6 h-8 bg-primary/40 rounded-t-sm"></div>
            <div class="w-1/6 h-16 bg-primary/60 rounded-t-sm"></div>
            <div class="w-1/6 h-12 bg-primary/40 rounded-t-sm"></div>
            <div class="w-1/6 h-24 bg-primary rounded-t-sm"></div>
          </div>
        </div>

      </section>
    </div>
    </main>
  `,
})
export class Analiticas {
  saas = inject(Saas);

  currentPage = signal(1);
  private readonly itemsPerPage = 3;

  starterCount = computed(() => this.saas.starterClientsCount());
  proCount = computed(() => this.saas.proClientsCount());
  enterpriseCount = computed(() => this.saas.enterpriseClientsCount());
  totalCount = computed(() => this.saas.totalClientsCount() || 1);

  starterPercentage = computed(() => Math.round((this.starterCount() / this.totalCount()) * 100));
  proPercentage = computed(() => Math.round((this.proCount() / this.totalCount()) * 100));
  enterprisePercentage = computed(() => Math.round((this.enterpriseCount() / this.totalCount()) * 100));

  allCountries = computed(() => this.saas.clientsByCountry());
  
  totalPages = computed(() => Math.ceil(this.allCountries().length / this.itemsPerPage));

  pages = computed(() => {
    const total = this.totalPages();
    const arr = [];
    for (let i = 1; i <= total; i++) arr.push(i);
    return arr;
  });
  
  paginatedCountries = computed(() => {
    const countries = this.allCountries();
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return countries.slice(start, end);
  });

  displayStart = computed(() => {
    if (this.allCountries().length === 0) return 0;
    return (this.currentPage() - 1) * this.itemsPerPage + 1;
  });

  displayEnd = computed(() => {
    const calculatedEnd = this.currentPage() * this.itemsPerPage;
    return Math.min(calculatedEnd, this.allCountries().length);
  });

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  getFlagImage(code: string): string {
    return `https://flagcdn.com/${code.toLowerCase()}.svg`;
  }
}
