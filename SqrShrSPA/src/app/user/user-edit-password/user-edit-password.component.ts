import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../_models/user';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../_services/user.service';
import { NgForm } from '@angular/forms';
import { AlertifyService } from 'src/app/_services/alertify.service';

class UserEditPasswordModel {
  username: '';
  currentPassword: '';
  newPassword: '';
  confirmPassword: '';
}

@Component({
  selector: 'app-user-edit-password',
  templateUrl: './user-edit-password.component.html',
  styleUrls: ['./user-edit-password.component.scss']
})
export class UserEditPasswordComponent implements OnInit {
  user = new UserEditPasswordModel();

  @ViewChild('editForm') editForm: NgForm;

  constructor(private route: ActivatedRoute, private userService: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user.username = data['user'].username;
    });
  }

  updatePassword() {
    if (this.user.newPassword !== this.user.confirmPassword) {
      this.alertify.error('Passwords do not match');
    } else {
      this.userService.updatePassword(this.user).subscribe(next => {
        this.alertify.success('Password updated successfully');
        this.editForm.reset();
      }, error => {
        this.alertify.genericError();
      });
    }
  }

}
