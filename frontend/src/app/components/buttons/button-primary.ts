import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-button-primary',
  template: `
    <button
      type="button"
      (click)="onClick()"
      [disabled]="disabled"
      [class]="buttonClass"
    >
      @if (icon) {
      <span class="material-symbols-outlined" [class]="iconClass">{{ icon }}</span>
    }
      <span [class]="labelClass">{{ label }}</span>
    </button>
  `,
})
export class ButtonPrimary  {
  @Input() fullWidth = false;
  @Input() disabled = false;
  @Input() label = 'Nuevo presupuesto';
  @Input() icon = 'add';
  @Input() labelClass = 'text-sm font-bold';
  @Input() iconClass = 'text-xl';
  @Input() reversed = false;
  @Output() pressed = new EventEmitter<void>();

  onClick(): void {
    if (this.disabled) {
      return;
    }
    this.pressed.emit();
  }

  get buttonClass(): string {
    const layout = this.fullWidth
      ? 'w-full justify-center'
      : 'justify-center';
    const reversedLayout = this.reversed ? 'flex-row-reverse' : '';  

    const disabledState = this.disabled
      ? 'opacity-50 cursor-not-allowed pointer-events-none'
      : 'cursor-pointer';

    return `${layout} ${reversedLayout} flex items-center gap-2 rounded-lg bg-primary text-on-primary hover:bg-primary-fixed-dim px-4 py-2.5 transition-colors shadow-[0_0_20px_rgba(167,139,250,0.15)] ${disabledState}`;
  }
}

