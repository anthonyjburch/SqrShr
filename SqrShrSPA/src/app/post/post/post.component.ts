import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { trigger, transition, animate, style, state, group } from '@angular/animations';
import { Post } from 'src/app/_models/post';
import { PostService } from 'src/app/_services/post.service';
import { AuthService } from 'src/app/_services/auth.service';
import { delay } from 'q';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  animations: [
    trigger('slideInOut', [
        state('in', style({
            'opacity': '1', 'visibility': 'visible'
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
            })),
            animate('800ms ease-in-out', style({
                'opacity': '1'
            }))
        ]
        )])
    ]),
]
})
export class PostComponent implements OnInit {
  @Input() post: Post;
  @Input() posts: Post[];
  modalRef: BsModalRef;
  content: string;
  animationState = 'in';

  constructor(public authService: AuthService, private postService: PostService,
    private modalService: BsModalService, private router: Router) { }

  ngOnInit() {
  }

  openModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

  deletePost(post: Post) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(post.id).subscribe( () => {
        (async () => {
          this.animationState = 'out';
          await delay(600);
          this.posts.splice(this.posts.findIndex(p => p.id === post.id), 1);
        })();
      }, error => {
        alert(error);
      });
    }
  }

  cancelReply() {
    this.content = '';
    this.modalRef.hide();
    return true;
  }

  postReply() {
    const comment: any = {
        content: this.content
      };

    this.postService.submitPostComment(this.post.id, comment).pipe(
        map((response: Comment) => {
            this.post.comments.unshift(response);
            this.content = '';
            this.modalRef.hide();
            this.router.navigate(['/u/' + this.post.user.username + '/posts/' + this.post.id]);
        }, error => {
            alert(error);
        })
    ).subscribe();
  }
}
