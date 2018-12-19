import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from 'src/app/_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user: User;
  currentUser: User;
  followsUser = false;

  constructor(private userService: UserService, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });

    this.currentUser = this.authService.currentUser;
  }

  canViewProfile() {
    if (this.user.isPrivate && !this.currentUser) {
      return false;
    }

    if (this.user.isPrivate && this.currentUser && this.user.username === this.currentUser.username) {
      return true;
    }

    if (this.user.isPrivate && !this.user.isFollowing) {
      return false;
    }

    return true;
  }
}
