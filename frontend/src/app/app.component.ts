import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EmployeeListComponent],
  template: `
    <div class="min-h-screen bg-gray-100">
      <app-employee-list></app-employee-list>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'frontend';
}
