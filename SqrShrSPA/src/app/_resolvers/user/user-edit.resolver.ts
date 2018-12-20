import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../../_models/user';
import { UserService } from 'src/app/_services/user.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Injectable()

export class UserEditResolver implements Resolve<User> {
    constructor(private userService: UserService, private router: Router, private authService: AuthService,
        private alertify: AlertifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this.userService.getUser(this.authService.decodedToken.unique_name).pipe(
            catchError(error => {
                this.alertify.genericError();
                this.router.navigate(['/u']);
                return of(null);
            })
        );
    }
}
