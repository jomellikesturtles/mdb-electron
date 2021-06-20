import { Component, ContentChild, EventEmitter, Inject, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControlOptions, AsyncValidatorFn, FormControl, FormGroup, NgControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-input-container',
  templateUrl: './input-container.component.html',
  styleUrls: ['./input-container.component.scss'],
  // providers: [{
  //   provide: NG_VALUE_ACCESSOR,
  //   useExisting: forwardRef(() => DefaultValueAccessor),
  //   multi: true
  // }]
})
export class InputContainerComponent extends FormControl implements OnInit {

  @ContentChild(TemplateRef, {
    static: false
  })

  templateRef: TemplateRef<any>

  @ViewChild('select', { static: false }) select: TemplateRef<any>;
  @ViewChild('text', { static: false }) text: TemplateRef<any>;
  @ViewChild('checkbox', { static: false }) checkbox: TemplateRef<any>;
  @Input() fieldLabel: string
  @Input() inputType: string = 'text'
  @Input() defaultVal: string
  @Input() mdbFormControlName: string
  @Input() parentForm: FormGroup
  @Input() optionSelections: IOptionSelections[]
  @Input() mdbFormGroup: FormGroup
  @Output() outputEvent = new EventEmitter<any>();
  @Output() onChange = new EventEmitter<any>();
  @Output() value = new EventEmitter<any>();

  ngControl: NgControl;

  constructor(
    @Inject('formState') formState: any = null,
    @Inject('validatorOrOpts') validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    @Inject('asyncValidator') asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) { super(formState, validatorOrOpts, asyncValidator) }

  ngOnInit() {
  }

  onChangeFunc(value) {

    // const value = event
    if (value) {
      console.log(value)
      this.onChange.emit(value)
    }
    // const value = event.source.value
    // if (event.source.selected) {
    //   console.log(value)
    //   this.onChange.emit(value)
    // }
  }
}

interface IOptionSelections {
  value: any,
  label: string
}
