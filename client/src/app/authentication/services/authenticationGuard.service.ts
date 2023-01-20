import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
@Injectable()
export class AuthenticationGuardService implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.isLogged$.pipe(
      map((isLoggedIn) => {
        if (isLoggedIn) {
          return true;
        }
        this.router.navigateByUrl('/');
        return false;
      })
    );
  }
}
