import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../_models/user';
import { Pagination, PaginatedResult } from '../../_models/pagination';
import { UserService } from 'src/app/_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-user-following-list',
  templateUrl: './user-following-list.component.html',
  styleUrls: ['./user-following-list.component.scss']
})
export class UserFollowingListComponent implements OnInit {
  currentUser: User;
  user: User;
  following: User[];
  pagination: Pagination;

  constructor(private authService: AuthService, private userService: UserService, private route: ActivatedRoute,
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
      this.following = data['following'].result;
      this.pagination = data['following'].pagination;
    });

    this.currentUser = this.authService.currentUser;
  }

  loadFollowing() {
    this.userService.getFollowing(this.user.username, this.pagination.currentPage,
      this.pagination.itemsPerPage).subscribe((res: PaginatedResult<User[]>) => {
        this.following = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.genericError();
      });
  }
}
