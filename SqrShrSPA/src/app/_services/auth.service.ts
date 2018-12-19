import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  profileImageUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentProfileImageUrl = this.profileImageUrl.asObservable();

  constructor(private http: HttpClient) {}

  changeProfileImage(profileImage: string) {
    this.profileImageUrl.next(profileImage);
  }

  login(user: User) {
    return this.http.post(this.baseUrl + 'login', user).pipe(
      map((response: any) => {
        if (user) {
          localStorage.setItem('sqrshr-token', response.token);
          localStorage.setItem('sqrshr-user', JSON.stringify(response.user));
          this.currentUser = response.user;
          this.decodedToken = this.jwtHelper.decodeToken(response.token);

          if (this.currentUser.profileImageUrl) {
            this.changeProfileImage(this.currentUser.profileImageUrl);
          } else {
            this.changeProfileImage('../../assets/user.png');
          }
        }
      })
    );
  }

  register(user: User) {
    return this.http.post(this.baseUrl + 'register', user);
  }

  logout() {
    localStorage.removeItem('sqrshr-token');
    localStorage.removeItem('sqrshr-user');
    this.decodedToken = null;
    this.currentUser = null;
  }

  loggedIn() {
    const token = localStorage.getItem('sqrshr-token');
    return !this.jwtHelper.isTokenExpired(token);
  }
}
