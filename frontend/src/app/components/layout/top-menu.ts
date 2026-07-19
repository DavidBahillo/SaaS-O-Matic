import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Saas} from '../../saas';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-top-menu',
  imports: [CommonModule],
  template: `
    <header
      class="sticky top-0 z-40 bg-surface border-b border-outline-variant flex justify-between items-center h-16 px-4 md:px-6 w-full"
    >
      <div class="flex items-center gap-3 md:gap-6 min-w-0">
        <div class="md:hidden flex items-center gap-3">
          <div
            class="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-primary-fixed font-bold shadow-[0_0_10px_rgba(167,139,250,0.3)]"
          >
            S
          </div>
          <span class="text-lg font-headline font-bold text-on-surface"
            >SaaS-O-Matic</span
          >
        </div>

        <div class="hidden md:flex items-center gap-2 text-sm font-body">
          <span class="text-on-surface-variant">SaaS-O-Matic</span>
          <span class="material-symbols-outlined text-[16px] text-outline"
            >chevron_right</span
          >

          @switch (saas.currentView()) { @case ('dashboard') {
          <span class="font-medium text-primary">Dashboard</span>
          } @case ('clientes') {
          <span class="font-medium text-primary">Clientes</span>
          } @case ('detalle-cliente') {
          <button
            (click)="saas.currentView.set('clientes')"
            class="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            Clientes
          </button>
          <span class="material-symbols-outlined text-[16px] text-outline"
            >chevron_right</span
          >
          <span class="font-medium text-primary"
            >{{ saas.selectedClient()?.name }}</span
          >
          } @case ('presupuesto') {
          <span class="font-medium text-on-surface-variant">Presupuestos</span>
          <span class="material-symbols-outlined text-[16px] text-outline"
            >chevron_right</span
          >
          <span class="font-medium text-primary">Calculadora</span>
          } @case ('analiticas') {
          <span class="font-medium text-on-surface-variant">Analíticas</span>
          <span class="material-symbols-outlined text-[16px] text-outline"
            >chevron_right</span
          >
          <span class="font-medium text-primary">Overview</span>
          } @case ('usuarios') {
          <span class="font-medium text-on-surface-variant">Administración</span>
          <span class="material-symbols-outlined text-[16px] text-outline"
            >chevron_right</span
          >
          <span class="font-medium text-primary">Usuarios</span>
          } @case ('ajustes') {
          <span class="font-medium text-on-surface-variant">Ajustes</span>
          <span class="material-symbols-outlined text-[16px] text-outline"
            >chevron_right</span
          >
          <span class="font-medium text-primary capitalize"
            >{{ saas.currentSettingsTab() }}</span
          >
          } }
        </div>
      </div>

      <div class="flex items-center gap-2 md:gap-4 shrink-0">
        <button
          type="button"
          (click)="saas.currentView.set('ajustes'); saas.currentSettingsTab.set('perfil')"
          class="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
        >
          <div
            class="h-8 w-8 rounded-full bg-surface-container-highest border border-outline-variant overflow-hidden"
          >
            <span class="material-symbols-outlined pt-0.5 text-primary">person</span>
          </div>
          <span class="text-xs font-semibold text-on-surface hidden xl:inline"
            >{{ saas.userProfile().name }}</span
          >
        </button>
        <button
          type="button"
          (click)="saas.logout()"
          class="inline-flex items-center gap-1.5 rounded-md border border-outline-variant px-2.5 py-1.5 text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:border-primary transition-colors cursor-pointer"
        >
          <span class="material-symbols-outlined text-[16px]">logout</span>
          <!-- Salir -->
        </button>
      </div>
    </header>
  `,
})
export class TopMenu {
  saas = inject(Saas);
}
