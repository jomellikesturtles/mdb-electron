import { Component, Input, Output, EventEmitter } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'ghost' | 'danger' | 'warning';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'mdb-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() icon: string = '';
  @Input() fullWidth: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Output() onClick = new EventEmitter<MouseEvent>();

  get buttonClasses(): string[] {
    return [
      `btn-${this.size}`,
      this.fullWidth ? 'btn-full-width' : ''
    ];
  }

  handleClick(event: MouseEvent) {
    if (!this.disabled && !this.loading) {
      this.onClick.emit(event);
    } else {
      event.stopPropagation();
    }
  }
}
