import { Component, Input } from '@angular/core';

@Component({
  selector: 'mdb-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
}
