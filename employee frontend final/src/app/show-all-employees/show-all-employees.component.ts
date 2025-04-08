import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-all-employees',
  templateUrl: './show-all-employees.component.html',
  styleUrls: ['./show-all-employees.component.css']
})
export class ShowAllEmployeesComponent implements OnInit {
  employees: Employee[] = [];

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  private getEmployees() {
    this.employeeService.getEmployeesList().subscribe(data => {
      this.employees = data;
    });
  }

  updateEmployee(id: number) {
    this.router.navigate(['update-employee', id]);
  }

  deleteEmployee(id: number) {
    this.employeeService.deleteEmployee(id).subscribe(data => {
      console.log(data);
      this.getEmployees();
    });
  }

  employeeDetails(id: number) {
    this.router.navigate(['show-details', id]);
  }

  goToAddEmployee() {
    this.router.navigate(['add-employee']);
  }

  downloadEmployeePDF() {
    this.employeeService.downloadEmployeePDF().subscribe(
      (data: Blob) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'employee-list.pdf';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error => {
        console.error('Error downloading PDF:', error);
        alert('Error downloading PDF. Please try again.');
      }
    );
  }
} 