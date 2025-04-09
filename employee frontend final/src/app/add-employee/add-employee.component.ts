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
  previewUrl: string | null = null;
  formSubmitted = false;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file size
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit.');
        return;
      }

      // Validate file type
      if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
        alert('Only JPEG and PNG files are allowed.');
        return;
      }

      this.selectedFile = file;

      // Preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(form: NgForm) {
    this.formSubmitted = true;

    // Form validation
    if (form.invalid) {
      return;
    }

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

    // Prepare FormData
    const formData = new FormData();
    const employeeBlob = new Blob([JSON.stringify(this.employee)], { type: 'application/json' });
    formData.append('employee', employeeBlob);

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    // Call service
    this.employeeService.createEmployee(formData).subscribe({
      next: (response: Employee) => {
        console.log('Employee created successfully', response);
        alert('Employee created successfully!');
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
