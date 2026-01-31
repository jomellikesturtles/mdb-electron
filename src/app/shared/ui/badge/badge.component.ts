import { Component, Input } from '@angular/core';

@Component({
  selector: 'mdb-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent {
  @Input() text: string = '';
  @Input() variant: 'default' | 'primary' | 'outline' = 'default';
  @Input() size: 'sm' | 'md' = 'sm';
}
