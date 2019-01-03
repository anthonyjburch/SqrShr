import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../../_models/user';
import { ProfileImage } from 'src/app/_models/profileImage';
import { CroppieOptions } from 'croppie';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { NgxCroppieComponent } from 'ngx-croppie';

@Component({
  selector: 'app-user-profile-photo-uploader',
  templateUrl: './user-profile-photo-uploader.component.html',
  styleUrls: ['./user-profile-photo-uploader.component.scss']
})

export class UserProfilePhotoUploaderComponent implements OnInit, AfterViewInit {
  @Input() user: User;
  @Input() profileImages: ProfileImage[];
  @ViewChild('ngxCroppie') ngxCroppie: NgxCroppieComponent;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  baseUrl = environment.apiUrl;
  context: CanvasRenderingContext2D;
  cropping: boolean;
  croppieImage: string;
  croppedImage: string;

  constructor(private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.context = (<HTMLCanvasElement>this.canvas.nativeElement).getContext('2d');
  }

  public get croppieOptions(): CroppieOptions {
    const opts: CroppieOptions = {};
    opts.viewport = {
      width: 250,
      height: 250
    };

    opts.boundary = {
      width: 300,
      height: 300
    };

    opts.enforceBoundary = true;
    opts.enableOrientation = true;
    return opts;
  }

  fileChangeListener($event) {
    this.cropping = true;
    const file: File = $event.target.files[0];
    this.resizeImage(file);
  }

  launchEditor() {
    this.fileInput.nativeElement.click();
  }

  cancelEditor() {
    this.croppieImage = '';
    this.cropping = false;
  }

  submit() {
    const payload: any = {
      base64string: this.croppedImage
    };

    this.userService.uploadUserProfileImage(this.user, payload).subscribe((profileImage) => {
      if (this.profileImages) {
        this.profileImages.filter(i => i.current)[0].current = false;
        this.profileImages.unshift(profileImage);
      } else {
        this.profileImages = new Array();
        this.profileImages.push(profileImage);
      }

      this.user.profileImageUrl = profileImage.url;
      this.authService.changeProfileImage(profileImage.url);
      this.authService.currentUser.profileImageUrl = profileImage.url;
      localStorage.setItem('sqrshr-user', JSON.stringify(this.authService.currentUser));
    });

    this.cancelEditor();
  }

  resizeImage(file: File) {
    const img = document.createElement('img');

    img.onload = function (e) {
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 600;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      this.canvas.nativeElement.width = width;
      this.canvas.nativeElement.height = height;
      this.context = this.canvas.nativeElement.getContext('2d');

      this.context.drawImage(img, 0, 0, width, height);
      this.croppieImage = this.canvas.nativeElement.toDataURL();
    }.bind(this);

    img.src = window.URL.createObjectURL(file);
  }

  updateCroppie(src: string) {
    this.ngxCroppie.outputFormatOptions = {
      type: 'base64',
      size: {
        width: 500,
        height: 500
      },
      format: 'png',
      quality: 1,
      circle: false
    };
    this.croppedImage = src;
  }

  rotateCounterClockwise() {
    this.ngxCroppie.rotate(90);
  }

  rotateClockwise() {
    this.ngxCroppie.rotate(-90);
  }
}
