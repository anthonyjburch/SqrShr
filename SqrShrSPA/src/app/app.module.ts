import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, CollapseModule, PaginationModule, CarouselModule, ModalModule } from 'ngx-bootstrap';
import { JwtModule } from '@auth0/angular-jwt';
import { FileUploadModule } from 'ng2-file-upload';
import { TimeAgoPipe } from 'time-ago-pipe';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AuthService } from './_services/auth.service';
import { SigninComponent } from './auth/signin/signin.component';
import { HomeComponent } from './home/home/home.component';
import { RegisterComponent } from './auth/register/register.component';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { UserComponent } from './user/user/user.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserListDetailComponent } from './user/user-list-detail/user-list-detail.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { UserListResolver } from './_resolvers/user/user-list.resolver';
import { UserDetailResolver } from './_resolvers/user/user-detail.resolver';
import { UserEditResolver } from './_resolvers/user/user-edit.resolver';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UserEditProfileComponent } from './user/user-edit-profile/user-edit-profile.component';
import { UserEditPasswordComponent } from './user/user-edit-password/user-edit-password.component';
import { UserEditPrivacyComponent } from './user/user-edit-privacy/user-edit-privacy.component';
import { PostStreamComponent } from './post/post-stream/post-stream.component';
import { UserProfilePhotoUploaderComponent } from './user/user-profile-photo-uploader/user-profile-photo-uploader.component';
import { UserFollowerListComponent } from './user/user-follower-list/user-follower-list.component';
import { UserFollowersResolver } from './_resolvers/user/user-followers.resolver';
import { UserFollowingResolver } from './_resolvers/user/user-following.resolver';
import { UserFollowingListComponent } from './user/user-following-list/user-following-list.component';
import { UserPostsResolver } from './_resolvers/user/user-posts.resolver';
import { PostComponent } from './post/post/post.component';
import { PostCreateComponent } from './post/post-create/post-create.component';
import { UserFollowButtonComponent } from './user/user-follow-button/user-follow-button.component';
import { LocalTimePipe } from './_pipes/local-time.pipe';
import { CapitalizeFirstPipe } from './_pipes/capitalize-first.pipe';
import { ScoreComponent } from './post/score/score.component';
import { PostCommentsComponent } from './post/post-comments/post-comments.component';
import { PostCommentsResolver } from './_resolvers/user/post-comments.resolver';
import { AppRoutingModule } from './app-routing.module';

export function tokenGetter() {
    return localStorage.getItem('sqrshr-token');
}

@NgModule({
   declarations: [
      AppComponent,
      HomeComponent,
      NavComponent,
      RegisterComponent,
      SigninComponent,
      UserComponent,
      UserListComponent,
      UserListDetailComponent,
      UserFollowerListComponent,
      UserFollowingListComponent,
      UserFollowButtonComponent,
      UserDetailComponent,
      UserEditComponent,
      UserEditProfileComponent,
      UserEditPasswordComponent,
      UserEditPrivacyComponent,
      UserProfilePhotoUploaderComponent,
      PostStreamComponent,
      PostComponent,
      PostCommentsComponent,
      ScoreComponent,
      PostCreateComponent,
      TimeAgoPipe,
      LocalTimePipe,
      CapitalizeFirstPipe
   ],
   imports: [
      AppRoutingModule,
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      FileUploadModule,
      BsDropdownModule.forRoot(),
      PaginationModule.forRoot(),
      CollapseModule.forRoot(),
      CarouselModule.forRoot(),
      ModalModule.forRoot(),
      JwtModule.forRoot({
          config: {
              tokenGetter: tokenGetter,
              whitelistedDomains: ['localhost:5000'],
              blacklistedRoutes: ['localhost:5000/api/auth']
          }
      })
   ],
   providers: [
       AuthService,
       ErrorInterceptorProvider,
       UserListResolver,
       UserDetailResolver,
       UserEditResolver,
       UserFollowersResolver,
       UserFollowingResolver,
       UserPostsResolver,
       PostCommentsResolver
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
