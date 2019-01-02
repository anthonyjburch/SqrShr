import { Component, OnInit, Input, ElementRef, ViewChild, Renderer } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../../_models/user';
import { ProfileImage } from 'src/app/_models/profileImage';
import { _appIdRandomProviderFactory } from '@angular/core/src/application_tokens';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-user-profile-photo-uploader',
  templateUrl: './user-profile-photo-uploader.component.html',
  styleUrls: ['./user-profile-photo-uploader.component.scss']
})

export class UserProfilePhotoUploaderComponent implements OnInit {
  @ViewChild('cropper') cropper: ImageCropperComponent;
  @ViewChild('fileInput') fileInput: ElementRef;
  @Input() user: User;
  @Input() profileImages: ProfileImage[];
  baseUrl = environment.apiUrl;
  cropperSettings: CropperSettings;
  cropperImg: any;

  constructor(private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    this.cropperImg = {};
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.preserveSize = true;
    this.cropperSettings.canvasWidth = 200;
    this.cropperSettings.canvasHeight = 200;
  }

  fileChangeListener($event) {
    const image: any = new Image();
    const file: File = $event.target.files[0];
    const myReader: FileReader = new FileReader();
    const that = this;
    myReader.onloadend = function (loadEvent: any) {
        image.src = loadEvent.target.result;
        that.cropper.setImage(image);
    };

    if (file) {
      myReader.readAsDataURL(file);
    }
  }

  submit() {
    const payload: any = {
      base64string: this.cropper.image.image
    };

    this.userService.uploadUserProfileImage(this.user, payload).subscribe((profileImage) => {
      if (this.profileImages) {
        this.profileImages.filter(i => i.current)[0].current = false;
      }

      if (this.profileImages) {
        this.profileImages.unshift(profileImage);
      } else {
        this.profileImages = new Array();
        this.profileImages.push(profileImage);
      }

      this.user.profileImageUrl = profileImage.url;
      this.authService.changeProfileImage(profileImage.url);
      this.authService.currentUser.profileImageUrl = profileImage.url;
      localStorage.setItem('sqrshr-user', JSON.stringify(this.authService.currentUser));
      this.cancelEditor();
    });
  }

  launchEditor() {
    this.fileInput.nativeElement.click();
  }

  cancelEditor() {
    this.cropperImg = {};
  }

}
