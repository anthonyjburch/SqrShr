import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { trigger, transition, animate, style, state, group } from '@angular/animations';
import { environment } from '../../../environments/environment';
import { User } from '../../_models/user';
import { DomSanitizer } from '@angular/platform-browser';
import { PostService } from '../../_services/post.service';
import { Post } from 'src/app/_models/post';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { CroppieOptions } from 'croppie';
import { NgxCroppieComponent } from 'ngx-croppie';
import { map } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
  animations: [
    trigger('slideInOut', [
        state('in', style({
            'max-height': '500px', 'opacity': '1', 'visibility': 'visible'
        })),
        state('out', style({
            'max-height': '0px', 'opacity': '0', 'visibility': 'hidden'
        })),
        transition('in => out', [group([
            animate('400ms ease-in-out', style({
                'opacity': '0'
            })),
            animate('600ms ease-in-out', style({
                'max-height': '0px'
            })),
            animate('700ms ease-in-out', style({
                'visibility': 'hidden'
            }))
        ]
        )]),
        transition('out => in', [group([
            animate('500ms ease-in-out', style({
                'visibility': 'visible'
            })),
            animate('600ms ease-in-out', style({
                'max-height': '500px'
            })),
            animate('800ms ease-in-out', style({
                'opacity': '1'
            }))
        ]
        )])
    ]),
]
})

export class PostCreateComponent implements OnInit, AfterViewInit {
  animationState = 'out';
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('ngxCroppie') ngxCroppie: NgxCroppieComponent;
  @Input() posts: Post[];
  @Input() user: User;
  context: CanvasRenderingContext2D;
  images: string[] = [];
  content: string;
  cropping: boolean;
  submitting: boolean;
  uploading: number;
  croppieImage: string;
  croppedImage: string;
  baseUrl = environment.apiUrl;

  constructor(private postService: PostService, private alertify: AlertifyService) { }

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
      opts.enableOrientation = true;
      opts.enforceBoundary = true;
      return opts;
  }

  openEditor() {
    this.animationState = 'in';
  }

  openFileSelector() {
      this.fileInput.nativeElement.click();
  }

  closeEditor() {
    this.animationState = 'out';
    this.images = [];
    this.content = '';
    this.closeCropper();
  }

  closeCropper() {
      this.fileInput.nativeElement.value = null;
      this.croppieImage = '';
      this.cropping = false;
  }

  fileChangeListener($event) {
      this.cropping = true;
      const file: File = $event.target.files[0];
      this.resizeImage(file);
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
          format: 'jpeg',
          quality: 1,
          circle: false
      };
      this.croppedImage = src;
  }

  submitCropper() {
      this.images.push(this.croppedImage);
      this.closeCropper();
  }

  removeImage(img: string) {
      if (confirm('Are you sure you want to remove this image?')) {
        this.images.splice(this.images.findIndex(i => i === img), 1);
      }
  }

  submitPost() {
      this.submitting = true;

      const post: any = {
          content: this.content
      };

      this.postService.submitPost(this.user.username, post).subscribe((postResponse) => {
        if (!this.images.length) {
            this.getPost(postResponse['id']);
            this.closeEditor();
            this.submitting = false;
        } else {
            const observables = [];
            for (let i = 0; i < this.images.length; i++) {
                const image = {
                    base64string: this.images[i]
                };
                observables.push(this.postService.uploadPostImage(postResponse['id'], image));
            }

            forkJoin(...observables).subscribe(() => {
                this.getPost(postResponse['id']);
                this.closeEditor();
                this.submitting = false;
            });
        }
      });
  }

  getPost(id: number) {
      this.postService.getPost(id).pipe(
          map((postResponse: Post) => {
              this.posts.unshift(postResponse);
          })
      ).subscribe();
  }

  rotateCounterClockwise() {
      this.ngxCroppie.rotate(90);
  }

  rotateClockwise() {
      this.ngxCroppie.rotate(-90);
  }
}
