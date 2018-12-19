import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../_models/user';
import { Post } from 'src/app/_models/post';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-post-stream',
  templateUrl: './post-stream.component.html',
  styleUrls: ['./post-stream.component.scss']
})
export class PostStreamComponent implements OnInit {
  user: User;
  posts: Post[];
  pagination: Pagination;
  loadingPosts = false;
  endOfPosts = false;

  constructor(private userService: UserService, public authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
      this.posts = data['posts'].result;
      this.pagination = data['posts'].pagination;
    });
  }

  loadPosts() {
    debugger;
    this.loadingPosts = true;
    this.pagination.currentPage++;
    let newPosts: Post[] = [];

    if (this.authService.currentUser.username === this.user.username) {
      this.userService.getStream(this.user.username, this.pagination.currentPage, this.pagination.itemsPerPage)
        .subscribe((res: PaginatedResult<Post[]>) => {
          newPosts = res.result;
          this.pagination = res.pagination;
          this.posts.push(...newPosts);

          if (this.posts.length >= this.pagination.totalItems) {
            this.endOfPosts = true;
          }

          this.loadingPosts = false;
        }, error => {
          alert(error);
        });
    } else {
      this.userService.getPosts(this.user.username, this.pagination.currentPage, this.pagination.itemsPerPage)
        .subscribe((res: PaginatedResult<Post[]>) => {
          newPosts = res.result;
          this.pagination = res.pagination;
          this.posts.push(...newPosts);
          if (this.posts.length >= this.pagination.totalItems) {
            this.endOfPosts = true;
          }

          this.loadingPosts = false;
        }, error => {
          alert(error);
        });
    }
  }

}