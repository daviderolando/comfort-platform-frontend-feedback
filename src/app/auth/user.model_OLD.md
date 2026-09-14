# user.model.ts

```ts
// User validation and TOKEN handling

export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationTime: number
  ) {}

  // This getter will make possible to call user.token as it was a property.
  // NB Getters are immutable
  get token() {
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

```
