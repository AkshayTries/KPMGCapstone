import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee';

@Component({
  selector: 'app-show-details',
  templateUrl: './show-details.component.html',
  styleUrls: ['./show-details.component.css']
})
export class ShowDetailsComponent implements OnInit {
  employee: Employee = new Employee();
  photoUrl: string = '';
  photoError: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.employeeService.getEmployeeById(id).subscribe({
      next: (data: Employee) => {
        this.employee = data;
        console.log("Employee data received:", this.employee);
        // Check if photoPath exists and has value
        if (this.employee.photoPath && this.employee.photoPath !== '') {
          this.photoUrl = this.employeeService.getPhotoUrl(this.employee.photoPath);
          console.log("Photo URL set to:", this.photoUrl);
          
          // Test the image URL
          const img = new Image();
          img.onload = () => {
            console.log("Image loaded successfully");
            this.photoError = false;
          };
          img.onerror = () => {
            console.log("Image failed to load");
            this.photoError = true;
          };
          img.src = this.photoUrl;
        } else {
          console.log("No photo path available for employee");
        }
      },
      error: (err) => console.error('Error fetching employee:', err)
    });
  }

  onImageError(): void {
    console.log('Image failed to load');
    this.photoError = true;
  }

  deleteEmployee(): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(this.employee.id).subscribe({
        next: () => {
          console.log('Employee deleted successfully');
          this.router.navigate(['/show-all-employees']);
        },
        error: (err) => {
          console.error('Error deleting employee:', err);
          alert('Error deleting employee. Please try again.');
        }
      });
    }
  }
}