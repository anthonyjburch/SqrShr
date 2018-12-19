import { Injectable } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { Router, ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../../_models/user';

@Injectable()

export class UserFollowersResolver implements Resolve<User[]> {
    pageNumber = 1;
    pageSize = 100;

    constructor(private userService: UserService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        return this.userService.getFollowers(route.params.username, this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                return of(null);
            })
        );
    }
}
