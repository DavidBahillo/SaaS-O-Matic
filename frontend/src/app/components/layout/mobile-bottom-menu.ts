import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Saas} from '../../saas';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-mobile-bottom-menu',
  imports: [CommonModule],
  template: `
    <div
      class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur border-t border-outline-variant h-18 px-2 pb-[max(env(safe-area-inset-bottom),0.25rem)]"
    >
      <div class="h-full w-full overflow-x-auto no-scrollbar">
        <div class="min-w-max h-full flex items-center gap-1 px-1">
          <button
            (click)="saas.currentView.set('dashboard')"
            [class]="saas.currentView() === 'dashboard' ? 'min-w-16 text-primary flex flex-col items-center justify-center gap-1 cursor-pointer px-2 py-1.5' : 'min-w-16 text-on-surface-variant flex flex-col items-center justify-center gap-1 cursor-pointer px-2 py-1.5'"
          >
            <span class="material-symbols-outlined text-[20px]">dashboard</span>
            <span class="text-[10px] leading-none">Dashboard</span>
          </button>
          <button
            (click)="saas.currentView.set('clientes')"
            [class]="saas.currentView() === 'clientes' ? 'min-w-16 text-primary flex flex-col items-center justify-center gap-1 cursor-pointer px-2 py-1.5' : 'min-w-16 text-on-surface-variant flex flex-col items-center justify-center gap-1 cursor-pointer px-2 py-1.5'"
          >
            <span class="material-symbols-outlined text-[20px]">group</span>
            <span class="text-[10px] leading-none">Clientes</span>
          </button>
          <button
            (click)="saas.currentView.set('presupuesto')"
            [class]="saas.currentView() === 'presupuesto' ? 'min-w-18 text-primary flex flex-col items-center justify-center gap-1 cursor-pointer px-2 py-1.5' : 'min-w-18 text-on-surface-variant flex flex-col items-center justify-center gap-1 cursor-pointer px-2 py-1.5'"
          >
            <span class="material-symbols-outlined text-[20px]">description</span>
            <span class="text-[10px] leading-none">Presup.</span>
          </button>
          <button
            (click)="saas.currentView.set('analiticas')"
            [class]="saas.currentView() === 'analiticas' ? 'min-w-18 text-primary flex flex-col items-center justify-center gap-1 cursor-pointer px-2 py-1.5' : 'min-w-18 text-on-surface-variant flex flex-col items-center justify-center gap-1 cursor-pointer px-2 py-1.5'"
          >
            <span class="material-symbols-outlined text-[20px]">analytics</span>
            <span class="text-[10px] leading-none">Analítica</span>
          </button>
          <button
            (click)="saas.currentView.set('usuarios')"
            [class]="saas.currentView() === 'usuarios' ? 'min-w-16 text-primary flex flex-col items-center justify-center gap-1 cursor-pointer px-2 py-1.5' : 'min-w-16 text-on-surface-variant flex flex-col items-center justify-center gap-1 cursor-pointer px-2 py-1.5'"
          >
            <span class="material-symbols-outlined text-[20px]">manage_accounts</span>
            <span class="text-[10px] leading-none">Usuarios</span>
          </button>
          <button
            (click)="saas.currentView.set('ajustes')"
            [class]="saas.currentView() === 'ajustes' ? 'min-w-16 text-primary flex flex-col items-center justify-center gap-1 cursor-pointer px-2 py-1.5' : 'min-w-16 text-on-surface-variant flex flex-col items-center justify-center gap-1 cursor-pointer px-2 py-1.5'"
          >
            <span class="material-symbols-outlined text-[20px]">settings</span>
            <span class="text-[10px] leading-none">Ajustes</span>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class MobileBottomMenu {
  saas = inject(Saas);
}
