import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mdb-button',
  templateUrl: './mdb-button.component.html',
  styleUrls: ['./mdb-button.component.scss']
})
export class MdbButtonComponent implements OnInit {

  @Input() label: string
  constructor() { }

  ngOnInit() {
  }
  onClick() {

  }
}
