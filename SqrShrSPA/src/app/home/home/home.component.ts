import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  signIn = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.loggedIn()) {
      this.router.navigate(['/u/' + this.authService.decodedToken.unique_name]);
    }
  }

  setSignInMode(signIn: boolean) {
    this.signIn = signIn;
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

}
