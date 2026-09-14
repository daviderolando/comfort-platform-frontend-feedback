// User validation and TOKEN handling

export class User {
  constructor(
    public username: string,
    public id: string,
    private _token: string,
    private _refreshToken: string,
    private _tokenExpirationTime: number
  ) {}

  // This getter will make possible to call user.token as it was a property.
  // NB Getters are immutable
  get token() {
    console.log("🚀 ~ file: user.model.ts ~ line 19 ~ User ~ gettoken ~ new Date().getTime()", new Date().getTime())
    console.log("🚀 ~ file: user.model.ts ~ line 17 ~ User ~ gettoken ~ this._tokenExpirationTime", this._tokenExpirationTime * 1000)
    if (
      !this._tokenExpirationTime ||
      new Date().getTime() > this._tokenExpirationTime * 1000
      ) {
      return null;
    }
    return this._token;
  }

  get tokenExpirationTime() {
    return this._tokenExpirationTime;
  }
}

export interface SignUpResult {
  "status": boolean,
  "username": string,
  "userId": string,
  "token": string,
  "expirationTime": number,
  "error"?: string,
}

export interface UserSession {
  "username": string,
  "userId": string,
  "accessToken": string,
  "idToken": string,
  "refreshToken": string,
  "clockDrift"?: number,
  "expirationTime": number,
}

// export class User {
//   constructor(
//     public email: string,
//     public id: string,
//     private _token: string,
//     private _tokenExpirationTime: number
//   ) {}

//   // This getter will make possible to call user.token as it was a property.
//   // NB Getters are immutable
//   get token() {
//     if (
//       !this._tokenExpirationTime ||
//       new Date().getTime() > this._tokenExpirationTime * 1000
//     ) {
//       return null;
//     }
//     return this._token;
//   }

//   get tokenExpirationTime() {
//     return this._tokenExpirationTime;
//   }
// }


