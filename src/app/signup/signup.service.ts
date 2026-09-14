import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

export interface SignupVerifyResponse {
  status: boolean;
}

export interface SignupSubmitResponse {
  status: boolean,
  username: string;
  pin: string;
  debug?: any;
}

export interface SignupInput {
  signup: string,
  nationality: string,
  gender: string,
  year_of_birth: number
}

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private apiSignUpUrl = environment.signupEndPointAPI + '/signup';

  public invalidSignupCode: boolean = false;
  private _createdUsername: string = '';
  private _createdPin: string = '';

  constructor(private http: HttpClient) {}

  public signupWithCode(signupCode: string, nationality: string, gender: string, year_of_birth: string) {
    const body = {
      signup: signupCode,
      nationality: nationality,
      gender: gender,
      year_of_birth: year_of_birth
    };
    console.log("Signup request body:");
    console.log(body);
    return this.http.post<SignupSubmitResponse>(this.apiSignUpUrl, body).pipe(
      tap((resData) => {
        // console.log('Signup code response (tap):');
        // console.log(resData);
      })
    );
  }

  public verifySignupCode(signupCode: string) {
    const body = {
      check_id: signupCode,
    };
    return this.http.post<SignupVerifyResponse>(this.apiSignUpUrl, body).pipe(
      tap((resData) => {
        // console.log('Verify code response (tap):');
        // console.log(resData);
      })
    );
  }

  public setNewCredentials(username: string, pin: string){
    this._createdUsername = username;
    this._createdPin = pin;
  }

  public get createdUsername(){
    return this._createdUsername;
  }

  public get createdPin(){
    return this._createdPin;
  }
}
