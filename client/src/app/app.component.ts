import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "./authentication/services/authentication.service";
import {SocketService} from "./shared/services/socket.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  // title = 'PUSL3120ANG2';
  constructor(
    private authService: AuthenticationService,
    private socketService: SocketService,
) {  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (currentUser) => {

        this.socketService.setupSocketConnection(currentUser);
        console.log('currentUser-app-components', currentUser);// comment for checking only
        this.authService.setCurrentUser(currentUser);
      },
      error: (err) => {
        console.log('err', err);
        this.authService.setCurrentUser(null);
      },
    });

    /////////////to check logged in status dev check
    this.authService.currentUser$.subscribe((res)=> {
        console.log('res',res);
      });
    this.authService.isLogged$.subscribe((isLoggedIn)=>{
      console.log('isLoggedIn',isLoggedIn);
    });
    ///////////////


  }
}



