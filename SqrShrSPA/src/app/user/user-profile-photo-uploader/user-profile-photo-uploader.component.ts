import { Component, OnInit, Input, ElementRef, ViewChild, Renderer, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FileUploader } from 'ng2-file-upload';
import { User } from '../../_models/user';
import { ProfileImage } from 'src/app/_models/profileImage';
import { AuthService } from 'src/app/_services/auth.service';
import { _appIdRandomProviderFactory } from '@angular/core/src/application_tokens';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-user-profile-photo-uploader',
  templateUrl: './user-profile-photo-uploader.component.html',
  styleUrls: ['./user-profile-photo-uploader.component.scss']
})

export class UserProfilePhotoUploaderComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  @Input() user: User;
  @Input() profileImages: ProfileImage[];
  @Output() previewUrl = new EventEmitter();
  sanitizer: DomSanitizer;
  baseUrl = environment.apiUrl;

  uploader: FileUploader;
  hasBaseDropZoneOver = false;

  constructor(private render: Renderer, private authService: AuthService, private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    this.initializeUploader();
    this.sanitizer = this.domSanitizer;
  }

  inputClick() {
    this.fileInput.nativeElement.click();
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.user.username + '/profileimage',
      authToken: 'Bearer ' + localStorage.getItem('sqrshr-token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      if (this.uploader.queue.length > 1) {
        this.uploader.removeFromQueue(this.uploader.queue[0]);
      }
      const url = (window.URL) ? window.URL.createObjectURL(file._file) : (window as any).webkitURL.createObjectURL(file._file);
      this.setPreviewUrl(url);
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        if (this.profileImages) {
          this.profileImages.filter(i => i.current)[0].current = false;
        }

        this.setPreviewUrl('');

        const res: ProfileImage = JSON.parse(response);
        const profileImage = {
          id: res.id,
          publicId: res.publicId,
          url: res.url,
          dateAdded: res.dateAdded,
          current: res.current
        };

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
      }
    };
  }

  setPreviewUrl(url) {
    this.previewUrl.emit(url);
  }

}
