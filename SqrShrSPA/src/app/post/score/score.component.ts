import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../../_models/post';
import { Comment } from '../../_models/comment';
import { Vote } from '../../_models/vote';
import { PostService } from '../../_services/post.service';
import { AuthService } from '../../_services/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {
  @Input() post: Post;
  @Input() comment: Comment;
  vote: Vote;

  constructor(private postService: PostService, public authService: AuthService) { }

  ngOnInit() {
    if (this.authService.currentUser) {
      if (this.post) {
        this.postService.getPostVote(this.post.id, this.authService.currentUser.username).pipe(
          map((response: Vote) => {
            this.vote = response;
          })
        ).subscribe();
      } else if (this.comment) {
        this.postService.getCommentVote(this.comment.id, this.authService.currentUser.username).pipe(
          map((response: Vote) => {
            this.vote = response;
          })
        ).subscribe();
      }
    }
  }

  sendVote(up: boolean) {
    const vote: any = {
      upvote: up
    };

    if (this.post) {
      this.postService.setPostVote(this.post.id, vote).pipe(
        map((response: Vote) => {
          this.setVote(up);
          this.vote = response;
        })
      ).subscribe();
    } else if (this.comment) {
      this.postService.setCommentVote(this.comment.id, vote).pipe(
        map((response: Vote) => {
          this.setVote(up);
          this.vote = response;
        })
      ).subscribe();
    }
  }

  setVote(up: boolean) {
    if (this.post) {
      if (this.vote && this.vote.upvote && up) {
        this.post.score--;
      } else if (this.vote && this.vote.upvote && !up) {
        this.post.score = this.post.score - 2;
      } else if (this.vote && !this.vote.upvote && up) {
        this.post.score = this.post.score + 2;
      } else if (this.vote && !this.vote.upvote && !up) {
        this.post.score++;
      } else if (!this.vote && up) {
        this.post.score++;
      } else if (!this.vote && !up) {
        this.post.score--;
      }
    } else if (this.comment) {
      if (this.vote && this.vote.upvote && up) {
        this.comment.score--;
      } else if (this.vote && this.vote.upvote && !up) {
        this.comment.score = this.comment.score - 2;
      } else if (this.vote && !this.vote.upvote && up) {
        this.comment.score = this.comment.score + 2;
      } else if (this.vote && !this.vote.upvote && !up) {
        this.comment.score++;
      } else if (!this.vote && up) {
        this.comment.score++;
      } else if (!this.vote && !up) {
        this.comment.score--;
      }
    }
  }

}
