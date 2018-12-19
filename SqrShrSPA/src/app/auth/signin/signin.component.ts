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

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.model).subscribe(next => {
      console.log('Logged in succesfully');
      this.router.navigate(['/u/' + this.model.username]);
    }, error => {
      console.log(error);
    });
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  register() {
    this.signUp.emit(false);
  }

}
