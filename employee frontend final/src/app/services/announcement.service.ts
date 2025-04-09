import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Announcement } from '../models/announcement.model';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private apiUrl = 'http://localhost:8080/api/announcements';

  constructor(private http: HttpClient) { }

  // Helper function to get headers with Authorization token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // assuming you store token in localStorage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createAnnouncement(announcement: { title: string, content: string }): Observable<Announcement> {
    return this.http.post<Announcement>(this.apiUrl, announcement, { headers: this.getHeaders() });
  }

  deleteAnnouncement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
