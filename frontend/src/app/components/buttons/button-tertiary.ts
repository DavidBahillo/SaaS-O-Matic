import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-button-tertiary',
  template: `
    <button
      type="button"
      (click)="pressed.emit()"
      [class]="buttonClass"
    >@if (icon) {
      <span class="material-symbols-outlined" [class]="iconClass">{{ icon }}</span>
    }
    <span [class]="labelClass">{{ label }}</span>
    </button>
  `,
})
export class ButtonTertiary {
  @Input() fullWidth = false;
  @Input() label = 'Añadir cliente';
  @Input() icon = 'person_add';
  @Input() labelClass = 'text-sm font-medium';
  @Input() iconClass = 'text-xl';
  @Input() buttonColorClass = false;
  @Input() reversed = false;
  @Output() pressed = new EventEmitter<void>();

  get buttonClass(): string {
    const layout = this.fullWidth
      ? 'w-full text-center justify-center'
      : 'justify-center';
    const buttonColorClass = this.buttonColorClass
      ? 'text-primary hover:text-primary-fixed-dim'
      : '';
      const reversedLayout = this.reversed ? 'flex-row-reverse' : '';

    return `${layout} flex items-center gap-2  rounded-lg px-4 py-2.5 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer ${buttonColorClass} ${reversedLayout}`;
  }
}
