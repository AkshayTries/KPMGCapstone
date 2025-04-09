import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from './employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseURL = "http://localhost:8080/api/v1/employees";

  constructor(private httpClient: HttpClient) { }

  // Get all employees
  getEmployeesList(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(`${this.baseURL}`);
  }

  // Create employee with optional photo
  createEmployee(employee: Employee, photo?: File): Observable<Employee> {
    if (photo) {
      return this.createEmployeeWithPhoto(employee, photo);
    } else {
      return this.httpClient.post<Employee>(`${this.baseURL}`, employee);
    }
  }

  // Private method for photo upload
  private createEmployeeWithPhoto(employee: Employee, photo: File): Observable<Employee> {
    const formData = new FormData();
    formData.append('employee', new Blob([JSON.stringify(employee)], {
      type: 'application/json'
    }));
    formData.append('photo', photo);
    
    return this.httpClient.post<Employee>(`${this.baseURL}`, formData);
  }

  // Get single employee
  getEmployeeById(id: number): Observable<Employee> {
    return this.httpClient.get<Employee>(`${this.baseURL}/${id}`);
  }

  // Update employee with optional photo
  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.put<Employee>(
        `${this.baseURL}/${id}`, 
        employee,
        { headers }
    );
}
  

  // Delete employee
  deleteEmployee(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/${id}`);
  }

  // Get photo URL (for displaying in UI)
  getPhotoUrl(photoPath: string): string {
    console.log("Photo path received:", photoPath);
    console.log("Base URL:", this.baseURL);
    // Use the correct API endpoint for serving images
    const fullUrl = `http://localhost:8080/api/v1/uploads/${photoPath}`;
    console.log("Constructed full URL:", fullUrl);
    
    // Test if the image exists
    this.httpClient.get(fullUrl, { responseType: 'blob' }).subscribe({
      next: () => console.log("Image exists at URL"),
      error: (err) => console.error("Image not found or error accessing:", err)
    });
    
    return fullUrl;
  }
}