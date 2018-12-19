import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { AuthService } from '../../_services/auth.service';
import { VirtualTimeScheduler } from 'rxjs';
import { NgForm } from '@angular/forms';

class UserDeleteModel {
  username: string;
  password: string;
}

@Component({
  selector: 'app-user-edit-privacy',
  templateUrl: './user-edit-privacy.component.html',
  styleUrls: ['./user-edit-privacy.component.scss']
})
export class UserEditPrivacyComponent implements OnInit {
  user: User;
  userDelete = new UserDeleteModel();
  showDeleteForm: boolean;

  @ViewChild('deleteForm') deleteForm: NgForm;

  constructor(private route: ActivatedRoute, private userService: UserService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
  }

  togglePrivate() {
    this.user.isPrivate = !this.user.isPrivate;
    this.userService.updateUser(this.user).subscribe(next => {
      alert('User Privacy set ' + this.user.isPrivate);
    }, error => {
      alert(error);
    });
  }

  toggleDeleteForm() {
    this.showDeleteForm = !this.showDeleteForm;
    this.deleteForm.reset();
  }

  deleteUser() {
    this.userDelete.username = this.user.username;
    this.userService.deleteUser(this.userDelete).subscribe(next => {
      alert('Deleted user ' + this.user.username);
      this.authService.logout();
      this.router.navigate(['']);
    }, error => {
      alert(error);
    });
  }
}
