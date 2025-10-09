import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Subject, throwError } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

declare global {
  interface Window {
    onGoogleSignIn: (response: any) => void;
  }
}
declare const google: any;

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    animations: egretAnimations,
    standalone: false
})
export class SigninComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;
  @Output() loginWithGoogle: EventEmitter<any> = new EventEmitter<any>();
  

  isLoading = false;


  signupForm: UntypedFormGroup;
  hidePassword = true;
  errorMsg = '';
  private _unsubscribeAll: Subject<any>;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private jwtAuth: JwtAuthService,
    private egretLoader: AppLoaderService,
    private http:HttpClient, private translate:TranslateService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {

    this.translate.use("fr");

    this.signupForm = this.fb.group({
      email: ['support@ui-lib.com', [Validators.required, Validators.email]],
      password: ['12345678', Validators.required],
      remember: [false]
    });

    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
    window.onGoogleSignIn= this.onGoogleSignIn.bind(this);

    this.initializeGoogleSignIn();
  }

  ngAfterViewInit() {
    // Uncomment if you want auto sign-in
    // this.autoSignIn();
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(1);
    this._unsubscribeAll.complete();
  }

  //GOOGLE AUTH
  onGoogleSignIn() {
    //console.log(res);
    google.accounts.id.initialize({
      client_id: environment.googleConfig.apiKey,
      callback: this.handleCredentialResponse.bind(this)
    });
    google.accounts.id.renderButton(
      document.getElementById("googleLoginButton"),
      { theme: "outline", size: "large", text: "continue_with" }
    );
    google.accounts.id.prompt(); 
  }
  initializeGoogleSignIn() {
    google.accounts.id.initialize({
      client_id: environment.googleConfig.apiKey,
      callback: this.handleCredentialResponse.bind(this)
    });
    google.accounts.id.renderButton(
      document.getElementById("googleLoginButton"),
      { theme: "outline", size: "large", text: "continue_with" }
    );
    
    google.accounts.id.prompt(); 
  }
  handleCredentialResponse(response: any) {
    const ask$ = this.http.post(environment.apiURL+"/auth/google",response).pipe(
        map((result:any) => {this.validGauth(result)}), catchError(err => throwError(err))
    )
    ask$.subscribe();
  }
  googleSignin(googleWrapper: any) {
    googleWrapper.click();
  }
  validGauth(res) {
    this.jwtAuth.setUserAndToken(res.token,res.user,true);
    this.router.navigateByUrl(this.jwtAuth.return);
    this.isLoading = false;
  }
  /**
   * CUSTOM AUTH ON SUBMIT BUTTON CLICK
   */
  onSubmit() {
    if (this.signupForm.valid) {
      const signinData = this.signupForm.value;
      
      this.submitButton.disabled = true;
      this.progressBar.mode = 'indeterminate';
      this.isLoading = true;
      this.jwtAuth.signin(signinData.email, signinData.password)
      .subscribe({
        next: (response) => {
          this.router.navigateByUrl(this.jwtAuth.return);
          this.isLoading = false;
        },
        error: (err) => {
          this.submitButton.disabled = false;
          this.progressBar.mode = 'determinate';
          this.errorMsg = err.message;
          this.isLoading = false;
        }
      });
    }
  }

  
  autoSignIn() {
    if (this.jwtAuth.return === '/') {
      return;
    }
    this.egretLoader.open(`Automatically Signing you in! \n Return url: ${this.jwtAuth.return.substring(0, 20)}...`, {width: '320px'});
    setTimeout(() => {
      this.onSubmit();
      this.egretLoader.close();
    }, 2000);
  }
}
