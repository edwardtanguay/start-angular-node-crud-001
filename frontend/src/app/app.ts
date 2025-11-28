import { Component } from '@angular/core';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';

@Component({
  selector: 'app-root',
  imports: [EmployeeListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
