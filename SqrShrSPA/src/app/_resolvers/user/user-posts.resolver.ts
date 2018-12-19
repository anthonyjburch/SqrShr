import { Injectable } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { Router, ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Post } from '../../_models/post';
import { AuthService } from '../../_services/auth.service';

@Injectable()

export class UserPostsResolver implements Resolve<Post[]> {
    pageNumber = 1;
    pageSize = 10;

    constructor(private authService: AuthService, private userService: UserService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Post[]> {
        if (this.authService.currentUser && route.params.username === this.authService.currentUser.username) {
            return this.userService.getStream(route.params.username, this.pageNumber, this.pageSize).pipe(
                catchError(error => {
                    return of(null);
                })
            );
        } else {
            return this.userService.getPosts(route.params.username, this.pageNumber, this.pageSize).pipe(
                catchError(error => {
                    return of(null);
                })
            );
        }
    }
}
