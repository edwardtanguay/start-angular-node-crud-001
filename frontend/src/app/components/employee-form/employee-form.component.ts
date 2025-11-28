import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnChanges {
  @Input() employee: Employee | undefined;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  employeeForm: FormGroup;
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  isSubmitting = false;

  constructor() {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position: ['', Validators.required],
      department: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      hireDate: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee'] && this.employee) {
      this.employeeForm.patchValue(this.employee);
    } else if (changes['employee'] && !this.employee) {
      this.employeeForm.reset({
        salary: 0
      });
    }
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.isSubmitting = true;
      const formValue = this.employeeForm.value;

      if (this.employee) {
        this.employeeService.updateEmployee(this.employee.id, formValue).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.save.emit();
          },
          error: () => {
            this.isSubmitting = false;
            alert('Failed to update employee');
          }
        });
      } else {
        this.employeeService.createEmployee(formValue).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.save.emit();
          },
          error: () => {
            this.isSubmitting = false;
            alert('Failed to create employee');
          }
        });
      }
    }
  }

  onCancel() {
    this.close.emit();
  }
}
