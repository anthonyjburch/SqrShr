import { Component, OnInit, Input, ElementRef, ViewChild, Renderer } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../../_models/user';
import { ProfileImage } from 'src/app/_models/profileImage';
import { _appIdRandomProviderFactory } from '@angular/core/src/application_tokens';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';

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

  constructor() { }

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
    console.log(this.cropperImg.image);
  }

  launchEditor() {
    this.fileInput.nativeElement.click();
  }

  cancelEditor() {
    this.cropperImg = {};
  }

}
