import { Subscription } from 'rxjs';
import { SignupService } from './../signup.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-signup-submit',
  templateUrl: './signup-submit.component.html',
  styleUrls: ['./signup-submit.component.css'],
})
export class SignupSubmitComponent implements OnInit {
  private verifySub: Subscription;
  private submitSub: Subscription;
  private signupCode: string;
  public isSuccess: boolean = true;
  public genders: string[] = ['male', 'female', 'other'];
  public years: number[] = [];

  constructor(
    private signupService: SignupService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Init variables
    this.route.params.subscribe((params: Params) => {
      this.signupCode = params['code'];
      // console.log('The parameter signup code is: ', this.signupCode);
    });

    // Verify code
    this.verifySub = this.signupService
      .verifySignupCode(this.signupCode)
      .subscribe((resData) => {
        // console.log('Verify code response (signup subscribe):', resData.status);

        if (!resData.status) {
          // Code is not valid -> redirect
          this.signupService.invalidSignupCode = true;
          this.router.navigateByUrl('/signup');
        }
      });

    // Populate valid years of birth
    const setYears = () => {
      const thisYear = new Date().getFullYear();
      const firstValidYear = thisYear - 18;
      let y = [];
      for (let i = firstValidYear; i > firstValidYear - 100; i--) {
        y.push(i);
      }
      return y;
    };
    this.years = setYears();
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const code = this.signupCode;
    const nationality = form.value.nationality;
    const gender = form.value.gender;
    const year_of_birth = form.value.year_of_birth;

    this.submitSub = this.signupService
      .signupWithCode(code, nationality, gender, year_of_birth)
      .subscribe((resData) => {
        // console.log('Signup code response (subscribe):');
        // console.log(resData);

        if (resData.status) {
          // Submission succeded
          // Store temporary new credentials
          const createdUsername = resData.username;
          const createdPin = resData.pin;
          this.signupService.setNewCredentials(createdUsername, createdPin);
          // Redirect
          this.router.navigateByUrl('/signup/signup-success');
        } else {
          // Submission failed -> show error
          this.isSuccess = false;
          setTimeout(() => {
            this.isSuccess = true;
          }, 3000);
        }
      });
  }

  ngOnDestroy() {
    if (this.submitSub) {
      this.submitSub.unsubscribe();
    }
    if (this.verifySub) {
      this.verifySub.unsubscribe();
    }
  }
}
