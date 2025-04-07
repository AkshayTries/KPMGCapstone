import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-register',
  templateUrl: './admin-register.component.html',
  styleUrls: ['./admin-register.component.css']
})
export class AdminRegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    const adminData = {
      adminName: this.email,
      adminPassword: this.password
    };
  
    this.http.post<any>('http://localhost:8080/api/v1/admin', adminData).subscribe(
      response => {
        console.log('Registration successful', response);
        alert(response.message); // ✅ use response.message
        this.router.navigate(['/admin-login']);
      },
      error => {
        console.error('Error during registration', error);
        alert('Registration failed');
      }
    );
  }
  
}
