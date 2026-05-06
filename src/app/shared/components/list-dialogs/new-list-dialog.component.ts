import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-list-dialog',
  template: `
    <div class="new-list-dialog">
      <h2 mat-dialog-title>New List</h2>
      <mat-dialog-content>
        <form [formGroup]="listForm" class="d-flex flex-column gap-3 mt-2">
          <mdb-input 
            label="Name" 
            formControlName="name" 
            placeholder="Enter list name" 
            [required]="true"
            error="List name is required">
          </mdb-input>

          <mdb-input 
            label="Description" 
            formControlName="description" 
            placeholder="Enter description (optional)">
          </mdb-input>
        </form>
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="mt-3">
        <mdb-button variant="text" (onClick)="onCancel()">Cancel</mdb-button>
        <mdb-button variant="primary" (onClick)="onCreate()" [disabled]="listForm.invalid">Create</mdb-button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .new-list-dialog {
      min-width: 350px;
      padding: 8px;
    }
    mat-dialog-content {
      overflow: hidden;
    }
  `]
})
export class NewListDialogComponent implements OnInit {
  listForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewListDialogComponent>
  ) { }

  ngOnInit(): void {
    this.listForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      description: ['']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.listForm.valid) {
      this.dialogRef.close(this.listForm.value);
    }
  }
}
