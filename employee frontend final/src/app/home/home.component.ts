import { Component, OnInit } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // ✅ Import AuthService

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [NgbCarouselModule]
})
export class HomeComponent implements OnInit { // ✅ Implement OnInit

  adminName: string = ''; // ✅ Add adminName property

  constructor(
    private router: Router,
    private authService: AuthService // ✅ Inject AuthService
  ) { }

  ngOnInit() {
    this.adminName = this.authService.getAdminName(); // ✅ Get admin name on init
  }

  goToEmployeeList() {
    this.router.navigate(['/show-all-employees']);
  }

  // images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/2000/600`);
}
