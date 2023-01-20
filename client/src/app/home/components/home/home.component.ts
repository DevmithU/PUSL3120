import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import {Router} from "@angular/router";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  isLoggedInSubscription: Subscription | undefined;

  constructor(
    private authService: AuthenticationService,
    private router: Router) {}

  ngOnInit(): void {
    this.isLoggedInSubscription = this.authService.isLogged$.subscribe(
      (isLoggedIn) => {
        if (isLoggedIn) {
          this.router.navigateByUrl('/dashBoard');
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.isLoggedInSubscription?.unsubscribe();

  }
}
