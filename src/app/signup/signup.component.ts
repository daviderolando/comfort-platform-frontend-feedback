import { AuthService } from './../auth/auth.service';
import { Router } from '@angular/router';
import { Observable, Observer, Subscription } from 'rxjs';
import { SignupService } from './signup.service';
import { NgForm } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  private verifySub: Subscription;
  private signupSub: Subscription;
  // private signupObs: Observable<any>;

  // GUI helpers
  public didFail = false;
  public isLoading = false;
  public isValid: boolean = true;
  public confirmUser: boolean = false;
  public signupError: boolean = false;
  public signupErrorMessage: string = '';

  constructor(private signupService: SignupService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    // Subscribe to service events
    this.authService.authIsLoading.subscribe(
      (isLoading: boolean) => this.isLoading = isLoading
    );
    this.authService.authDidFail.subscribe(
      (didFail: boolean) => {
        this.didFail = didFail;
        this.signupError = didFail;
      }
    );
    this.authService.authError.subscribe(
      (authError: string) => this.signupErrorMessage = authError
    );

    if ( this.signupService.invalidSignupCode ){
      this.isValid = false;
      setTimeout(() => {
        this.isValid = true;
      }, 3000);
    }
  }

  onTestObs() {
    window.alert('Not implemented yet.');
  }

  onTestSignUp() {
    window.alert('Not implemented yet. Signup will be connected to the FastAPI backend later.');
  }

  onConfirmToggle() {
    this.confirmUser = !this.confirmUser;
  }

  onConfirm(formValue: { usrName: string, validationCode: string }) {
    window.alert('Not implemented yet. Account confirmation will be connected to the FastAPI backend later.');
  }

  onSubmitSignUp(form: NgForm){
    if(!form.valid){
      return;
    }

    window.alert('Not implemented yet. Signup will be connected to the FastAPI backend later.');
    form.reset();
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }

    window.alert('Not implemented yet. Signup code verification will be connected to the FastAPI backend later.');

  }

  ngOnDestroy(){
    if (this.verifySub) {
      this.verifySub.unsubscribe();
    }
    if (this.signupSub) {
      this.signupSub.unsubscribe();
    }
  }
}
