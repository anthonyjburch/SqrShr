import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../../_models/user';
import { UserService } from 'src/app/_services/user.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()

export class UserDetailResolver implements Resolve<User> {
    constructor(private userService: UserService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this.userService.getUser(route.params['username']).pipe(
            catchError(error => {
                alert('Problem retrieving data.');
                this.router.navigate(['/u']);
                return of(null);
            })
        );
    }
}