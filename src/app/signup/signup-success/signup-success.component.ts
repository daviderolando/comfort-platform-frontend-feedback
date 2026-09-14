import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SignupService } from '../signup.service';

@Component({
  selector: 'app-signup-success',
  templateUrl: './signup-success.component.html',
  styleUrls: ['./signup-success.component.css']
})
export class SignupSuccessComponent implements OnInit {

  public tempUsername: string = '';
  public tempPin: string = '';

  constructor(private signupService: SignupService, private router: Router) { }

  ngOnInit(): void {
    this.tempUsername = this.signupService.createdUsername;
    this.tempPin = this.signupService.createdPin;

    if (this.tempUsername == '' || this.tempPin == ''){
      // Credentials not valid (not really set) -> redirect
      this.router.navigateByUrl('/signup');
    }
  }

  onLoginRedirect(){
    // Clear temporary credentials
    this.signupService.setNewCredentials('', '');
    this.tempUsername = '****';
    this.tempPin = '****';
    this.router.navigateByUrl('/auth');
  }

}
