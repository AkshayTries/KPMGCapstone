import { Component } from '@angular/core';
import { Employee } from '../employee';
import { Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.css']
})
export class UpdateEmployeeComponent {
  id: number;
  employee: Employee = new Employee();
  selectedFile: File | null = null;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.id = 0;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.employeeService.getEmployeeById(this.id).subscribe(
      data => {
        this.employee = data;
      },
      error => console.log(error)
    );
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    // Remove the selectedFile parameter since we're not updating photos
    this.employeeService.updateEmployee(this.id, this.employee).subscribe({
        next: (data) => {
            this.goToEmployeeList();
        },
        error: (error) => {
            console.error('Update error:', error);
            // Add user-friendly error handling here
        }
    });
}

  goToEmployeeList() {
    this.router.navigate(['/show-all-employees']);
  }
}
