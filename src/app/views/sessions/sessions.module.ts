import { PerfectScrollbarModule } from 'app/shared/components/perfect-scrollbar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";

import { TranslateModule } from '@ngx-translate/core';

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { SessionsRoutes } from "./sessions.routing";
import { NotFoundComponent } from './not-found/not-found.component';
import { ErrorComponent } from './error/error.component';
import { commonMaterialModules, allMaterialModules } from 'app/shared/material-imports';
import { DividerComponent } from 'app/shared/components/divider/divider.component';
import { ForgotPassword2Component } from './forgot-password2/forgot-password2.component';
import { GoogleSigninComponent } from './signin/google-signin/google-signin.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    ...commonMaterialModules,
    ...allMaterialModules,
    PerfectScrollbarModule,
    DividerComponent,
    GoogleSigninComponent,
    RouterModule.forChild(SessionsRoutes)
  ],
  declarations: [
    
    ForgotPasswordComponent,
    ForgotPassword2Component,
    LockscreenComponent, 
    SigninComponent, 
    SignupComponent, 
    NotFoundComponent, 
    ErrorComponent,
  ]
})
export class SessionsModule { }