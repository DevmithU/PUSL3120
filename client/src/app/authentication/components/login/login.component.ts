import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import {LoginRequestInterface} from "../../types/loginRequest.interface";
import {SocketService} from "../../../shared/services/socket.service";

@Component({
  selector: 'authentication-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  errorMessage: string | null = null;

  form = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private socketService: SocketService

) {}

  onSubmit(): void {
    this.authService.login(<LoginRequestInterface>(this.form.value)).subscribe({
      next: (currentUser) => {
        console.log('currentUser-login', currentUser);
        this.authService.setToken(currentUser);
        this.socketService.setupSocketConnection(currentUser);
        this.authService.setCurrentUser(currentUser);
        this.errorMessage = null;
        this.router.navigateByUrl('/');
      },
      error: (err: HttpErrorResponse) => {
        console.log('err', err.error);
        this.errorMessage = err.error.emailOrPassword;
      },
    });
  }
}
