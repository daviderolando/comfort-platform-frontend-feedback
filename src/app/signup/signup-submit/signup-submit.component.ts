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

    window.alert('Not implemented yet. Anonymous account creation will be connected to the FastAPI backend later.');
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
