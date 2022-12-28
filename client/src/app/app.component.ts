import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth/services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  // title = 'PUSL3120ANG';
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (currentUser) => {

        console.log('currentUser', currentUser);// comment for checking only
        this.authService.setCurrentUser(currentUser);
      },
      error: (err) => {
        console.log('err', err);
        this.authService.setCurrentUser(null);
      },
    });

    ///////////////to check logged in status dev check
    // this.authService.currentUser$.subscribe((res)=> {
    //     console.log('res',res);
    //   });
    // this.authService.isLogged$.subscribe((isLoggedIn)=>{
    //   console.log('isLoggedIn',isLoggedIn);
    // });
    /////////////////


  }
}



