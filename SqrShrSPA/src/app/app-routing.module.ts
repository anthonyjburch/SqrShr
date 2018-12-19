import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { UserListResolver } from './_resolvers/user/user-list.resolver';
import { UserDetailResolver } from './_resolvers/user/user-detail.resolver';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UserEditResolver } from './_resolvers/user/user-edit.resolver';
import { UserEditProfileComponent } from './user/user-edit-profile/user-edit-profile.component';
import { UserEditPasswordComponent } from './user/user-edit-password/user-edit-password.component';
import { UserEditPrivacyComponent } from './user/user-edit-privacy/user-edit-privacy.component';
import { UserFollowersResolver } from './_resolvers/user/user-followers.resolver';
import { UserFollowingResolver } from './_resolvers/user/user-following.resolver';
import { UserFollowingListComponent } from './user/user-following-list/user-following-list.component';
import { UserFollowerListComponent } from './user/user-follower-list/user-follower-list.component';
import { PostStreamComponent } from './post/post-stream/post-stream.component';
import { UserPostsResolver } from './_resolvers/user/user-posts.resolver';
import { PostCommentsComponent } from './post/post-comments/post-comments.component';
import { PostCommentsResolver } from './_resolvers/user/post-comments.resolver';
import { NgModel } from '@angular/forms';
import { NgModule } from '@angular/core';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'u', component: UserListComponent, resolve: {users: UserListResolver} },
    { path: 'u/edit', component: UserEditComponent, resolve: {user: UserEditResolver}, children: [
        { path: 'profile', component: UserEditProfileComponent, outlet: 'profile', resolve: {user: UserEditResolver}},
        { path: 'password', component: UserEditPasswordComponent, outlet: 'profile', resolve: {user: UserEditResolver}},
        { path: 'privacy', component: UserEditPrivacyComponent, outlet: 'profile', resolve: {user: UserEditResolver}}
    ]},
    { path: 'u/:username', component: PostStreamComponent, resolve: {user: UserDetailResolver, posts: UserPostsResolver}},
    { path: 'u/:username/following', component: UserFollowingListComponent,
        resolve: {user: UserDetailResolver, following: UserFollowingResolver}
    },
    { path: 'u/:username/followers', component: UserFollowerListComponent,
        resolve: {user: UserDetailResolver, following: UserFollowingResolver, followers: UserFollowersResolver}
    },
    { path: 'u/:username/posts/:postId', component: PostCommentsComponent, resolve: {post: PostCommentsResolver} },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        scrollPositionRestoration: 'enabled'
    })],
    exports: [RouterModule]
})

export class AppRoutingModule { }
