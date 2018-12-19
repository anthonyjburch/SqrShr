import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isCollapsed = true;
  profileImageUrl: string;

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.currentProfileImageUrl.subscribe(profileImageUrl => {
      this.profileImageUrl = profileImageUrl;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  toggleNav() {
    this.isCollapsed = !this.isCollapsed;
  }
}
