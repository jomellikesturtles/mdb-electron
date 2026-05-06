import { Component, Input } from '@angular/core';

@Component({
  selector: 'mdb-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  @Input() src: string = '';
  @Input() alt: string = 'Avatar';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() border: boolean = false;
  
  get classes(): string[] {
    return [
      `size-${this.size}`,
      this.border ? 'border' : ''
    ];
  }
}
