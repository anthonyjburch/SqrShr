import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PostService } from 'src/app/_services/post.service';
import { Post } from 'src/app/_models/post';

@Injectable()

export class PostCommentsResolver implements Resolve<Post> {
    constructor(private postService: PostService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Post> {
        return this.postService.getPost(route.params['postId']).pipe(
            catchError(error => {
                alert('Problem retrieving data: PostCommentResolver');
                this.router.navigate(['/u' + route.params['username'].value]);
                return of (null);
            })
        );
    }
}
