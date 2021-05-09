import { AfterViewInit, Component, ContentChild, ElementRef, EventEmitter, forwardRef, Inject, Input, OnDestroy, OnInit, Output, Renderer, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControlOptions, AsyncValidatorFn, DefaultValueAccessor, FormControl, FormGroup, NgControl, NG_VALUE_ACCESSOR, ValidatorFn } from '@angular/forms';

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
export class InputContainerComponent extends FormControl implements OnInit, AfterViewInit, OnDestroy {

  @ContentChild(TemplateRef, {
    // read?: any;
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
  @ViewChild('element', { static: false }) element: ElementRef
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

  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
  }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
  }

  onChangeFunc(event) {
    const value = event.source.value
    if (event.source.selected) {
      console.log(value)
      this.onChange.emit(value)
    }
  }
}


interface IOptionSelections {
  value: any,
  label: string
}
