import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.authService.user.pipe(
      map((user) => {
        const isAuth = !!user;
        console.log('Info from guard: user? ', user);
        if (isAuth) {
          return true;
        }

        // Returna UrlTree
        return this.router.createUrlTree(['/auth']);
      })
    );

    // Old redirect approach that can lead to weird behaviors
    // return this.authService.user.pipe(
    //   map((user) => {
    //     return !!user;
    //   }),
    //   tap((isAuth) => {
    //     if (!isAuth) {
    //       this.router.navigate(['/auth']);
    //     }
    //   })
    // );
  }
}
