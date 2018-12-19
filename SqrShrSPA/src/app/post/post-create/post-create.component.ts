import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { trigger, transition, animate, style, state, group } from '@angular/animations';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { User } from '../../_models/user';
import { DomSanitizer } from '@angular/platform-browser';
import { PostService } from '../../_services/post.service';
import { Post } from 'src/app/_models/post';
import { map } from 'rxjs/operators';

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

export class PostCreateComponent implements OnInit {
  animationState = 'out';
  @ViewChild('fileInput') fileInput: ElementRef;
  @Input() posts: Post[];
  @Input() user: User;
  images: any[] = [];
  content: string;
  uploader: FileUploader;
  baseUrl = environment.apiUrl;
  sanitizer: DomSanitizer;
  loading = false;

  constructor(private postService: PostService, private domSanitizer: DomSanitizer) { }

  ngOnInit() {
      this.sanitizer = this.domSanitizer;
      this.initializeUploader();
  }

  openEditor() {
    this.animationState = 'in';
  }

  closeEditor() {
    this.animationState = 'out';
    this.images = [];
    this.content = '';
  }

  openPhotoSelector() {
      this.fileInput.nativeElement.click();
  }

  removeImage(img: any) {
      this.images.splice(this.images.findIndex(i => i === img), 1);
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      authToken: 'Bearer ' + localStorage.getItem('sqrshr-token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
        file.withCredentials = false;
        const url = (window.URL) ? window.URL.createObjectURL(file._file) : (window as any).webkitURL.createObjectURL(file._file);
        this.images.push(url);
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
        if (this.uploader.queue.length === 1) {
            const postId = item.url.replace('/image', '').split('/')[item.url.replace('/image', '').split('/').length - 1];
            this.addToPostsList(+postId);
        }
    };
  }

  addToPostsList(postId: number) {
      this.postService.getPost(postId).pipe(
          map((postResponse: Post) => {
              this.posts.unshift(postResponse);
              this.closeEditor();
              this.loading = false;
          })
      ).subscribe();
  }

  submitPost() {
    const post: any = {
        content: this.content
    };

    this.postService.submitPost(this.user.username, post).subscribe((postResponse) => {
        this.loading = true;
        this.uploader.onBeforeUploadItem = (item) => {
            item.url = this.baseUrl + 'posts/' + postResponse['id'] + '/image';
        };

        if (this.uploader.queue.length > 0) {
            this.uploader.uploadAll();
        } else {
            this.addToPostsList(postResponse['id']);
        }
    }, error => {
        alert(error);
    });
  }
}
