import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../_models/user';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { UserService } from 'src/app/_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-user-follower-list',
  templateUrl: './user-follower-list.component.html',
  styleUrls: ['./user-follower-list.component.scss']
})
export class UserFollowerListComponent implements OnInit {
  user: User;
  currentUser: User;
  followers: User[];
  followerPagination: Pagination;

  constructor(private authService: AuthService, private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
      this.followers = data['followers'].result;
      this.followerPagination = data['followers'].pagination;
    });

    this.currentUser = this.authService.currentUser;
  }

  loadFollowers() {
    this.userService.getFollowers(this.user.username, this.followerPagination.currentPage,
      this.followerPagination.itemsPerPage).subscribe((res: PaginatedResult<User[]>) => {
        this.followers = res.result;
        this.followerPagination = res.pagination;
      }, error => {
        alert(error);
      });
  }
}
