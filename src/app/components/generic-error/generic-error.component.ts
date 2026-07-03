
import { Component, OnInit } from '@angular/core';
import { TROUBLE_QUOTES } from '@shared/constants';

@Component({
  selector: 'generic-error',
  templateUrl: './generic-error.component.html',
  styleUrls: ['./generic-error.component.scss'],
})
export class GenericErrorComponent implements OnInit {
  troubleQuote: { title: string; year: number; quote: string };

  ngOnInit() {
    const randomIndex = Math.floor(Math.random() * TROUBLE_QUOTES.length);
    this.troubleQuote = TROUBLE_QUOTES[randomIndex];
  }

  goBack() {
    window.history.back();
  }

  reload() {
    window.location.reload();
  }
}
