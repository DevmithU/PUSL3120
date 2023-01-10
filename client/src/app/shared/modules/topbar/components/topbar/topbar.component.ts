import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  userName: string | null | undefined ;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    // console.log("u22",this.authService.currentUser$.value?.username);
    this.userName = this.authService.currentUser$.value?.username;
    // let userName2 = this.authService.currentUser$;

  }
  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}


//userName
