import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { ButtonSecondary } from './buttons/button-secondary';
import { Customer, Saas } from '../saas';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-customer-card',
  imports: [ButtonSecondary, CommonModule],
  template: `
    
         
            <!-- Card -->
            <div class="bg-surface-container rounded-lg border border-outline-variant p-6 hover:bg-surface-container-high transition-colors group flex flex-col relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:bg-primary/10"></div>
              
              <div class="flex justify-between items-start mb-4 relative z-10">
                <div class="w-12 h-12 rounded bg-surface-container-highest border border-outline-variant flex items-center justify-center text-on-surface font-headline font-bold text-lg">
                  {{ getInitials(client.name) }}
                </div>
                <span class="inline-flex items-center rounded-full bg-surface-container-highest border border-outline-variant px-2.5 py-0.5 text-xs font-medium text-on-surface-variant">
                  {{ client.plan }}
                </span>
              </div>
              
              <div class="mb-6 relative z-10">
                <h4 class="text-lg font-headline font-semibold text-on-surface mb-1">{{ client.name }}</h4>
                <div class="flex items-center gap-3 text-sm text-on-surface-variant">
                  <span class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-[16px]">badge</span>
                    {{ client.cif }}
                  </span>
                  <span>•</span>
                  <span class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-[16px]">public</span>
                    {{ client.country }}
                  </span>
                </div>
              </div>
              
              <div class="mt-auto relative z-10">
                <app-button-secondary
                  (pressed)="saas.selectClient(client)"
                  [label]="'Ver Detalles'"
                  [fullWidth]="true"
                  [icon]="''"
                  [borderColorClass]="true"
                  
                />
              </div>
            </div>
       
       
  `,
  styles: ``,
})
export class CustomerCard {
  @Input({ required: true }) client!: Customer;

  saas = inject(Saas);

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
