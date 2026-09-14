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
    const signupObs = new Observable( (observer: Observer<any>) => {
      setInterval(
        () => {
          let randomNumber = Math.floor(Math.random() * 10);
          if(randomNumber == 8){
            observer.error("Error while generating random number: " + randomNumber);
          } else if(randomNumber == 9){
            observer.complete();
          }else {
            observer.next(randomNumber);
          }
        }, 1000);

    });

    signupObs.subscribe((data: Number) => {
      console.log("Next Number: " + data);
      }, error => {
        console.log(error);
      }, ()=>{
        console.log("Observable Completed");
    });
  }

  onTestSignUp() {
    this.signupSub = this.authService.signUp('davide2', 'Testpass99', 'davide.rolando@gmail.com').subscribe(
      data => {
        console.log("SignUp / Subscribe", data);
        this.confirmUser = true;
      },
      err => {
        console.log("Error caught at Subscriber " + err);
        this.signupError = true;
        this.signupErrorMessage = err;
        this.confirmUser = false;
      }
    );
  }

  onConfirmToggle() {
    this.confirmUser = !this.confirmUser;
  }

  onConfirm(formValue: { usrName: string, validationCode: string }) {
    this.authService.confirmUser(formValue.usrName, formValue.validationCode);
  }

  onSubmitSignUp(form: NgForm){
    if(!form.valid){
      return;
    }

    const usrName = form.value.username;
    const email = form.value.email;
    const password = form.value.password;
    this.authService.signUp(usrName, password, email).subscribe(data => {
      console.log("SignUp / Subscribe", data);
    });
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }

    const code = form.value.signupcode;

    this.verifySub = this.signupService.verifySignupCode(code).subscribe(resData => {
      // console.log('Verify code response (subscribe):');
      // console.log(resData);

      if (resData.status){
        // Code is valid -> redirect
        this.router.navigateByUrl('/signup' + '/' + code);
      } else {
        // Code is not valid -> show error
        this.isValid = false;
        setTimeout(() => {
          this.isValid = true;
        }, 3000)
      }
    });

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
