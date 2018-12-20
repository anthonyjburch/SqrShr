import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../_models/user';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../_services/user.service';
import { NgForm } from '@angular/forms';
import { ProfileImage } from '../../_models/profileImage';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/_services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-user-edit-profile',
  templateUrl: './user-edit-profile.component.html',
  styleUrls: ['./user-edit-profile.component.scss']
})
export class UserEditProfileComponent implements OnInit {
  user: User;
  profileImages: ProfileImage[];
  previewUrl: string;
  sanitizer: DomSanitizer;

  @ViewChild('editForm') editForm: NgForm;

  constructor(private route: ActivatedRoute, private userService: UserService,
    private http: HttpClient, private authService: AuthService, private domSanitizer: DomSanitizer,
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.sanitizer = this.domSanitizer;
    this.route.data.subscribe(data => {
      this.user = data['user'];
      this.userService.getUserProfileImages(this.user).pipe(
        map((response: ProfileImage[]) => {
          this.profileImages = response;
        })
      ).subscribe();
    });
  }

  updateUser() {
    this.userService.updateUser(this.user).subscribe(next => {
      this.editForm.reset(this.user);
    }, error => {
      this.alertify.genericError();
    });
  }

  setProfileImage(profileImage: ProfileImage) {
    if (profileImage.current) {
      return;
    }

    if (this.profileImages) {
      this.profileImages.filter(i => i.current)[0].current = false;
    }

    profileImage.current = true;
    this.userService.setUserProfileImage(this.user, profileImage).pipe(
      map((response: ProfileImage) => {
        this.user.profileImageUrl = response.url;
        this.authService.changeProfileImage(response.url);
        this.authService.currentUser.profileImageUrl = response.url;
        localStorage.setItem('sqrshr-user', JSON.stringify(this.authService.currentUser));
      })
    ).subscribe();
  }

  deleteProfileImage(profileImage: ProfileImage) {
    if (confirm('Are you sure you want to delete this image?')) {
      this.userService.deleteUserProfileImage(this.user, profileImage).subscribe(() => {
        this.profileImages.splice(this.profileImages.findIndex(i => i.id === profileImage.id), 1);
      }, error => {
        this.alertify.genericError();
      });
    }
  }

  setPreviewUrl(url: string) {
    this.previewUrl = url;
  }

}
