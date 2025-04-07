import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private adminNameKey = 'adminName';
  private isAdminKey = 'isAdmin';

  setAdminName(name: string) {
    localStorage.setItem(this.adminNameKey, name);
    // Assuming anyone who logs in is an admin
    localStorage.setItem(this.isAdminKey, 'true');
  }

  getAdminName(): string {
    return localStorage.getItem(this.adminNameKey) || '';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.adminNameKey);
  }

  isAdmin(): boolean {
    return localStorage.getItem(this.isAdminKey) === 'true';
  }

  logout() {
    localStorage.removeItem(this.adminNameKey);
    localStorage.removeItem(this.isAdminKey);
  }
}
