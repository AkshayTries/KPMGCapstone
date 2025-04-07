import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';



@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  name: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router,private authService: AuthService) {}

  login() {
    const adminData = {
      adminName: this.name,
      adminPassword: this.password
    };
  
    this.http.post<any>('http://localhost:8080/api/v1/login', adminData)
      .subscribe(
        response => {
          console.log('Login successful', response);
          alert(response.message);
          this.authService.setAdminName(response.adminName); // ✅ use response data
          this.router.navigate(['/home']);
        },
        error => {
          console.error('Login failed', error);
          alert('Invalid credentials. Please try again.');
        }
      );
  }
  
}