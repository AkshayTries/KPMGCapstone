import { Component, OnInit } from '@angular/core';
import { AnnouncementService } from '../services/announcement.service';
import { Announcement } from '../models/announcement.model';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css']
})
export class AnnouncementsComponent implements OnInit {
  announcements: Announcement[] = [];
  newAnnouncement = { title: '', content: '' };
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private announcementService: AnnouncementService) {}

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  loadAnnouncements(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.announcementService.getAnnouncements().subscribe({
      next: (data) => {
        this.announcements = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load announcements. Please try again later.';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  createAnnouncement(): void {
    if (!this.validateForm()) return;

    this.isLoading = true;
    this.errorMessage = '';
    
    this.announcementService.createAnnouncement(this.newAnnouncement).subscribe({
      next: () => {
        this.handleSuccess();
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  deleteAnnouncement(id: number): void {
    if (confirm('Are you sure you want to delete this announcement?')) {
      this.announcementService.deleteAnnouncement(id).subscribe({
        next: () => {
          this.announcements = this.announcements.filter(a => a.id !== id);
          this.successMessage = 'Announcement deleted successfully!';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete announcement';
          console.error(err);
        }
      });
    }
  }

  private validateForm(): boolean {
    if (!this.newAnnouncement.title.trim()) {
      this.errorMessage = 'Title is required';
      return false;
    }
    if (!this.newAnnouncement.content.trim()) {
      this.errorMessage = 'Content is required';
      return false;
    }
    return true;
  }

  private handleSuccess(): void {
    this.successMessage = 'Announcement posted successfully!';
    this.loadAnnouncements();
    this.newAnnouncement = { title: '', content: '' };
    setTimeout(() => this.successMessage = '', 3000);
  }

  private handleError(err: any): void {
    this.errorMessage = err.error?.message || 'Failed to create announcement';
    console.error(err);
    this.isLoading = false;
  }

  dismissAlert(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}