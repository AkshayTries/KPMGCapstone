import { Component } from '@angular/core';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {
  employee: Employee = new Employee();
  selectedFile: File | null = null;
  formSubmitted = false;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit(form: NgForm) {
    this.formSubmitted = true;
    
    if (form.invalid) {
      return;
    }

    // Ensure all required fields are set
    if (!this.employee.designation) {
      alert('Please enter a designation');
      return;
    }
    if (!this.employee.salary || this.employee.salary < 0) {
      alert('Please enter a valid salary');
      return;
    }
    if (!this.employee.joiningDate) {
      alert('Please select a joining date');
      return;
    }

    const createObservable = this.selectedFile
      ? this.employeeService.createEmployee(this.employee, this.selectedFile)
      : this.employeeService.createEmployee(this.employee);

    createObservable.subscribe({
      next: (response: Employee) => {
        console.log('Employee created successfully', response);
        this.goToEmployeeList();
      },
      error: (error: any) => {
        console.error('Error creating employee', error);
        alert('Error creating employee. Please try again.');
      }
    });
  }

  goToEmployeeList() {
    this.router.navigate(['/show-all-employees']);
  }
}