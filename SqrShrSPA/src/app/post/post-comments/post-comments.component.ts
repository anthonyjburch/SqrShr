import { Component, OnInit, TemplateRef } from '@angular/core';
import { Post } from 'src/app/_models/post';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { PostService } from 'src/app/_services/post.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.scss']
})
export class PostCommentsComponent implements OnInit {
  post: Post;
  content: string;
  modalRef: BsModalRef;
  constructor(public authService: AuthService, private postService: PostService,
    private route: ActivatedRoute, private modalService: BsModalService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.post = data['post'];
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

  deletePost() {

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
      }, error => {
        alert(error);
      })
    ).subscribe();
  }

  cancelReply() {
    this.content = '';
    this.modalRef.hide();
  }

}
