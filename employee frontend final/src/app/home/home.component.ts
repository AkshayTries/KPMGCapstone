import { Component, OnInit } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AnnouncementService } from '../services/announcement.service'; // ✅ Import AnnouncementService
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [NgbCarouselModule, CommonModule]
})
export class HomeComponent implements OnInit {

  adminName: string = '';
  announcements: any[] = []; // ✅ Add announcements property

  constructor(
    private router: Router,
    private authService: AuthService,
    private announcementService: AnnouncementService // ✅ Inject AnnouncementService
  ) { }

  ngOnInit() {
    this.adminName = this.authService.getAdminName();
    this.loadAnnouncements(); // ✅ Load announcements on init
  }

  goToEmployeeList() {
    this.router.navigate(['/show-all-employees']);
  }

  loadAnnouncements(): void {
    this.announcementService.getAnnouncements().subscribe({
      next: (data) => {
        this.announcements = data;
      },
      error: (error) => {
        console.error('Error fetching announcements:', error);
      }
    });
  }
}
