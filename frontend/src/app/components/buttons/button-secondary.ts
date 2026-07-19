import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-button-secondary',
  template: `
    <button
      type="button"
      (click)="onClick()"
      [disabled]="disabled"
      [class]="buttonClass"
    >@if (icon) {
      <span class="material-symbols-outlined" [class]="iconClass">{{ icon }}</span>
    }
    <span [class]="labelClass">{{ label }}</span>
    </button>
  `,
})
export class ButtonSecondary {
  @Input() fullWidth = false;
  @Input() disabled = false;
  @Input() label = 'Actualizar Credenciales';
  @Input() icon = 'update';
  @Input() labelClass = 'text-sm font-medium';
  @Input() iconClass = 'text-xl';
  @Input() buttonColorClass = false;
  @Input() reversed = false;
  @Input() borderColorClass = false;
  
  @Output() pressed = new EventEmitter<void>();

  onClick(): void {
    if (this.disabled) {
      return;
    }
    this.pressed.emit();
  }

  get buttonClass(): string {
    const layout = this.fullWidth
      ? 'w-full text-center justify-center'
      : 'justify-center';
    const buttonColorClass = this.buttonColorClass
      ? 'text-primary hover:text-primary-fixed-dim'
      : '';
      const reversedLayout = this.reversed ? 'flex-row-reverse' : '';
      const borderColorClass = this.borderColorClass ? 'border border-on-secondary-fixed-variant' : '';
     

    const disabledState = this.disabled
      ? 'opacity-50 cursor-not-allowed pointer-events-none'
      : 'cursor-pointer';

    return `${layout} ${borderColorClass} px-4 py-2 bg-transparent text-on-surface hover:text-primary hover:border-primary rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${disabledState} ${buttonColorClass} ${reversedLayout}`;
  }
}
