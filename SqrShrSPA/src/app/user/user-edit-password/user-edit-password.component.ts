import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../_models/user';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../_services/user.service';
import { NgForm } from '@angular/forms';

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

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user.username = data['user'].username;
    });
  }

  updatePassword() {
    if (this.user.newPassword !== this.user.confirmPassword) {
      alert('Passwords dont match');
    } else {
      this.userService.updatePassword(this.user).subscribe(next => {
        alert('Password updated successfully');
        this.editForm.reset();
      }, error => {
        alert(error);
      });
    }
  }

}
