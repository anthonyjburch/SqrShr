import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-follow-button',
  templateUrl: './user-follow-button.component.html',
  styleUrls: ['./user-follow-button.component.scss']
})
export class UserFollowButtonComponent implements OnInit {
  @Input() sourceUser: User;
  @Input() targetUser: User;

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  setFollow() {
    if (this.targetUser.isFollowing) {
      this.userService.unfollowUser(this.sourceUser.username, this.targetUser.username).subscribe(() => {
        this.targetUser.isFollowing = false;
      });
    } else {
      this.userService.followUser(this.sourceUser.username, this.targetUser.username).subscribe(() => {
        this.targetUser.isFollowing = true;
      });
    }
  }
}
