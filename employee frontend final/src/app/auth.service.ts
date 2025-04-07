import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  // Call this after login
  setAdminName(name: string): void {
    localStorage.setItem('adminName', name);
  }

  getAdminName(): string {
    return localStorage.getItem('adminName') || 'Admin';
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('adminName') !== null;
  }

  logout(): void {
    localStorage.removeItem('adminName');
    // Navigate to login page (optional)
  }
}
