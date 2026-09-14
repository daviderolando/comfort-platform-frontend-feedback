import { SignupSuccessComponent } from './signup/signup-success/signup-success.component';
import { TermsComponent } from './terms/terms.component';
import { SignupSubmitComponent } from './signup/signup-submit/signup-submit.component';
import { SignupComponent } from './signup/signup.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { DataComponent } from './data/data.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { NotificationComponent } from './notification/notification.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/feedback',
    pathMatch: 'full',
  },
  {
    path: 'feedback',
    component: FeedbackComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'data',
    component: DataComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'notification',
    component: NotificationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: 'terms',
    component: TermsComponent,
  },
  {
    path: 'signup',
    children: [
      { path: '', component: SignupComponent },
      { path: 'signup-success', component: SignupSuccessComponent },
      { path: ':code', component: SignupSubmitComponent },
    ]
  },
  {
    path: '**',
    redirectTo: '/feedback',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
