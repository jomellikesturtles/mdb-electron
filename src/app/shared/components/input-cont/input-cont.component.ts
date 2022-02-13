import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-cont',
  templateUrl: './input-cont.component.html',
  styleUrls: ['./input-cont.component.scss']
})
export class InputContComponent implements OnInit {

  @Input() parentForm: FormGroup
  constructor() { }

  ngOnInit() {
  }

}
