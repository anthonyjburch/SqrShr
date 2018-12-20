import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  @Output() signUp = new EventEmitter();
  model: any = {};
  invalid: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.invalid = '';
    this.authService.login(this.model).subscribe(next => {
      this.router.navigate(['/u/' + this.model.username]);
    }, error => {
      if (error === 'Unauthorized') {
        this.invalid = 'Invalid username or password.';
      } else {
        this.invalid = 'Error logging in user';
      }
    });
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  register() {
    this.signUp.emit(false);
  }

}
