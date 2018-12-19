import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../_models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})

export class RegisterComponent implements OnInit {
  @Output() signIn = new EventEmitter();
  user: User;
  registerForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9-_]*')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(24)]],
      email: ['', Validators.email]
    });
  }

  register() {
    this.user = Object.assign({}, this.registerForm.value);
    this.authService.register(this.user).subscribe(() => {
      console.log('Registration successful');
      this.login();
    }, error => {
      console.log(error);
    }, () => {
      this.router.navigate(['/u']);
    });
  }

  login() {
    this.authService.login(this.user).subscribe(next => {
    }, error => {
      console.log(error);
    }, () => {
      this.router.navigate(['/u']);
    });
  }

  signin() {
    this.signIn.emit(true);
  }

}
