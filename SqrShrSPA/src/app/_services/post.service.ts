import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Post } from '../_models/post';
import { User } from '../_models/user';
import { Observable } from 'rxjs';
import { Vote } from '../_models/vote';

@Injectable({
  providedIn: 'root'
})

export class PostService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPostVote(postId: number, username: string) {
    return this.http.get(this.baseUrl + 'posts/' + postId + '/vote/' + username);
  }

  getCommentVote(commentId: number, username: string) {
    return this.http.get(this.baseUrl + 'posts/comments/' + commentId + '/vote/' + username);
  }

  setPostVote(postId: number, vote: Vote) {
    return this.http.post(this.baseUrl + 'posts/' + postId + '/vote', vote);
  }

  setCommentVote(commentId: number, vote: Vote) {
    return this.http.post(this.baseUrl + 'posts/comments/' + commentId + '/vote', vote);
  }

  submitPost(username: string, post: Post) {
    return this.http.post(this.baseUrl + 'posts/' + username, post);
  }

  getPost(postId: number) {
    return this.http.get(this.baseUrl + 'posts/' + postId);
  }

  deletePost(postId: number) {
    return this.http.delete(this.baseUrl + 'posts/' + postId);
  }

  submitPostComment(postId: number, comment: Comment) {
    return this.http.post(this.baseUrl + 'posts/' + postId + '/comment', comment);
  }

  submitCommentComment(commentId: number, comment: Comment) {
    return this.http.post(this.baseUrl + 'posts/comments/' + commentId, comment);
  }

}
