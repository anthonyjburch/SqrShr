import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../../_models/user';
import { UserService } from 'src/app/_services/user.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Injectable()

export class UserListResolver implements Resolve<User[]> {
    pageNumber = 1;
    pageSize = 4;

    constructor(private userService: UserService, private router: Router, private alertify: AlertifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        return this.userService.getUsers(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertify.genericError();
                this.router.navigate(['/']);
                return of(null);
            })
        );
    }
}
