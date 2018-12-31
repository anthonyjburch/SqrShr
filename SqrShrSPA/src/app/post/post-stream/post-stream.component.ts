import { Component, OnInit, Input, HostListener } from '@angular/core';
import { User } from '../../_models/user';
import { Post } from 'src/app/_models/post';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

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

  constructor(private userService: UserService, public authService: AuthService,
    private route: ActivatedRoute, private alertify: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
      this.posts = data['posts'].result;
      this.pagination = data['posts'].pagination;
    });
  }

  loadPosts() {
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
          this.alertify.genericError();
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
          this.alertify.genericError();
        });
    }
  }

  @HostListener('window:scroll', ['$event'])
    checkScroll() {
      const scrollPosition = window.pageYOffset;
      const body = document.body;
      const html = document.documentElement;
      const height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,
        html.scrollHeight, html.offsetHeight);
      const percentage = +(scrollPosition / height).toFixed(2);
      if (percentage >= .8 && !this.loadingPosts && this.pagination.totalPages !== this.pagination.currentPage) {
        this.loadPosts();
      }
    }


}
