import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-button-danger',
  template: `
    <button
      type="button"
      (click)="pressed.emit()"
      [class]="buttonClass"
    >
       @if (icon) {
      <span class="material-symbols-outlined" [class]="iconClass">{{ icon }}</span>
    }
      <span [class]="labelClass">{{ label }}</span>
    </button>
  `,
})
export class ButtonDanger {
  @Input() fullWidth = false;
  @Input() label = 'Eliminar Cuenta';
  @Input() icon = 'add';
  @Input() labelClass = 'text-sm font-bold';
  @Input() iconClass = 'text-xl';
  
  @Output() pressed = new EventEmitter<void>();

  get buttonClass(): string {
    const layout = this.fullWidth ? 'w-full' : '';

    return `${layout} flex items-center gap-2 rounded-lg border border-error bg-transparent px-4 py-2 font-medium text-error hover:bg-error/10 transition-colors cursor-pointer`;
  }
}
