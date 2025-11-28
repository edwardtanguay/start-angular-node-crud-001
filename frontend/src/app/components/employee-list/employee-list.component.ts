import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';


@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule, EmployeeFormComponent],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees = signal<Employee[]>([]);
  searchTerm = signal('');
  sortColumn = signal<keyof Employee>('lastName');
  sortDirection = signal<'asc' | 'desc'>('asc');
  
  showForm = signal(false);
  selectedEmployee = signal<Employee | undefined>(undefined);

  filteredEmployees = computed(() => {
    const term = this.searchTerm().toLowerCase();
    let result = this.employees().filter(emp => 
      emp.firstName.toLowerCase().includes(term) ||
      emp.lastName.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term) ||
      emp.position.toLowerCase().includes(term) ||
      emp.department.toLowerCase().includes(term)
    );

    const col = this.sortColumn();
    const dir = this.sortDirection();

    result.sort((a, b) => {
      const valA = a[col];
      const valB = b[col];
      
      if (valA < valB) return dir === 'asc' ? -1 : 1;
      if (valA > valB) return dir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  });

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe(data => {
      this.employees.set(data);
    });
  }

  onSort(column: keyof Employee) {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  onDelete(id: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe(() => {
        this.loadEmployees();
      });
    }
  }

  openCreateModal() {
    this.selectedEmployee.set(undefined);
    this.showForm.set(true);
  }

  openEditModal(employee: Employee) {
    this.selectedEmployee.set(employee);
    this.showForm.set(true);
  }

  onFormClose() {
    this.showForm.set(false);
    this.selectedEmployee.set(undefined);
  }

  onFormSave() {
    this.loadEmployees();
    this.onFormClose();
  }
}
