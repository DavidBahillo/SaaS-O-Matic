import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Saas } from "../../saas";
import { ButtonTertiary } from "../buttons/button-tertiary";
import { ButtonPrimary } from "../buttons/button-primary";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-sidebar-menu",
  imports: [CommonModule, ButtonTertiary, ButtonPrimary],
  template: `
    <aside
      class="fixed inset-y-0 left-0 z-50 bg-surface text-on-surface h-screen w-64 border-r border-outline-variant flex-col py-6 px-4 hidden md:flex shrink-0"
    >
      <div class="flex items-center gap-3 mb-8 px-2">
        
        <div>
          <h1
            class="text-xl font-headline font-bold text-on-surface tracking-tighter leading-none"
          >
            SaaS-O-Matic
          </h1>
          <p
            class="text-xs text-on-surface-variant font-label uppercase tracking-widest mt-1"
          >
            Sales Management
          </p>
        </div>
      </div>

      <nav class="flex-1 space-y-1">
        <button
          (click)="saas.currentView.set('dashboard')"
          [class]="
            saas.currentView() === 'dashboard'
              ? 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary font-bold bg-surface-container transition-colors cursor-pointer text-left'
              : 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer text-left group'
          "
        >
          <span
            class="material-symbols-outlined text-xl group-hover:text-primary transition-colors"
            >dashboard</span
          >
          <span class="text-sm">Dashboard</span>
        </button>

        <button
          (click)="saas.currentView.set('clientes')"
          [class]="
            saas.currentView() === 'clientes' ||
            saas.currentView() === 'detalle-cliente'
              ? 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary font-bold bg-surface-container transition-colors cursor-pointer text-left'
              : 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer text-left group'
          "
        >
          <span
            class="material-symbols-outlined text-xl group-hover:text-primary transition-colors"
            >groups_2</span
          >
          <span class="text-sm">Clientes</span>
        </button>

        <button
          (click)="saas.currentView.set('presupuesto')"
          [class]="
            saas.currentView() === 'presupuesto'
              ? 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary font-bold bg-surface-container transition-colors cursor-pointer text-left'
              : 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer text-left group'
          "
        >
          <span
            class="material-symbols-outlined text-xl group-hover:text-primary transition-colors"
            >description</span
          >
          <span class="text-sm">Presupuestos</span>
        </button>

        <button
          (click)="saas.currentView.set('analiticas')"
          [class]="
            saas.currentView() === 'analiticas'
              ? 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary font-bold bg-surface-container transition-colors cursor-pointer text-left'
              : 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer text-left group'
          "
        >
          <span
            class="material-symbols-outlined text-xl group-hover:text-primary transition-colors"
            style="font-variation-settings: 'FILL' 0"
            >analytics</span
          >
          <span class="text-sm">Analíticas</span>
        </button>
        @if (saas.currentUserIsAdmin()) {
          <button
            (click)="saas.currentView.set('usuarios')"
            [class]="
              saas.currentView() === 'usuarios'
                ? 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary font-bold bg-surface-container transition-colors cursor-pointer text-left'
                : 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer text-left group'
            "
          >
            <span
              class="material-symbols-outlined text-xl group-hover:text-primary transition-colors"
              >manage_accounts</span
            >
            <span class="text-sm">Usuarios</span>
          </button>
        }
        <button
          (click)="saas.currentView.set('ajustes')"
          [class]="
            saas.currentView() === 'ajustes'
              ? 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary font-bold bg-surface-container transition-colors cursor-pointer text-left'
              : 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer text-left group'
          "
        >
          <span
            class="material-symbols-outlined text-xl group-hover:text-primary transition-colors"
            >settings</span
          >
          <span class="text-sm">Ajustes</span>
        </button>
      </nav>

      <div
        class="mt-auto pt-4 border-t gap-2 flex flex-col border-outline-variant/50"
      >
        <app-button-tertiary
          [fullWidth]="true"
          (pressed)="saas.showAddClientModal.set(true)"
          [buttonColorClass]="false"
          [label]="'Añadir Cliente'"
          [iconClass]="'text-[18px]'"
          [labelClass]="'text-sm font-semibold'"
        />
        <app-button-primary
          [label]="'Nuevo presupuesto'"
          [icon]="'add'"
          [fullWidth]="true"
          [iconClass]="'text-[18px]'"
          [labelClass]="'text-sm font-semibold'"
          (pressed)="saas.currentView.set('presupuesto')"
        />
      </div>
    </aside>
  `,
})
export class SidebarMenu {
  saas = inject(Saas);
}
