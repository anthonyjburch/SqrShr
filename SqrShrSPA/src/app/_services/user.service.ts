import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { identifierModuleUrl } from '@angular/compiler';
import { ProfileImage } from '../_models/profileImage';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { Post } from '../_models/post';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers(page?, itemsPerPage?): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http.get<User[]>(this.baseUrl + 'users', { observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
  }

  getUser(username: string): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + username);
  }

  followsUser(username: string, targetUsername: string) {
    return this.http.get<boolean>(this.baseUrl + 'users/' + username + '/follows/' + targetUsername);
  }

  followUser(username: string, targetUsername: string) {
    return this.http.post(this.baseUrl + 'users/' + username + '/follow/' + targetUsername, {});
  }

  unfollowUser(username: string, targetUsername: string) {
    return this.http.post(this.baseUrl + 'users/' + username + '/unfollow/' + targetUsername, {});
  }

  getFollowers(username: string, page?, itemsPerPage?): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http.get<User[]>(this.baseUrl + 'users/' + username + '/followers', { observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
  }

  getFollowing(username: string, page?, itemsPerPage?): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http.get<User[]>(this.baseUrl + 'users/' + username + '/following', { observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
  }

  getPosts(username: string, page?, itemsPerPage?): Observable<PaginatedResult<Post[]>> {
    const paginatedResult: PaginatedResult<Post[]> = new PaginatedResult<Post[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    return this.http.get<Post[]>(this.baseUrl + 'users/' + username + '/posts', { observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
  }

  getStream(username: string, page?, itemsPerPage?): Observable<PaginatedResult<Post[]>> {
    const paginatedResult: PaginatedResult<Post[]> = new PaginatedResult<Post[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http.get<Post[]>(this.baseUrl + 'users/' + username + '/stream', { observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
  }

  updateUser(user: User) {
    return this.http.put(this.baseUrl + 'users/' + user.username, user);
  }

  updatePassword(user: any) {
    return this.http.post(this.baseUrl + 'auth/updatepassword', user);
  }

  deleteUser(user: any) {
    return this.http.post(this.baseUrl + 'auth/deleteuser', user);
  }

  getUserProfileImages(user: User) {
    return this.http.get(this.baseUrl + 'users/' + user.username + '/profileimages');
  }

  setUserProfileImage(user: User, profileImage: ProfileImage) {
    return this.http.put(this.baseUrl + 'users/' + user.username + '/profileimage/', profileImage);
  }

  deleteUserProfileImage(user: User, profileImage: ProfileImage) {
    return this.http.delete(this.baseUrl + 'users/' + user.username + '/profileimage/' + profileImage.id);
  }
}
