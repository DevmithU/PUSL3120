import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import {RegisterRequestInterface} from "../../types/registerRequest.interface";
import {SocketService} from "../../../shared/services/socket.service";

@Component({
  selector: 'authentication-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  errorMessage: string | null | undefined ;
  isButtonDisabled = "disabled";
  isButtonDisabled2 = true;


  form = this.fb.group({
    email: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private socketService: SocketService
  ) {}
  ngOnInit(): void {
    this.isButtonDisabled = "disabled";
    this.isButtonDisabled2 = true;

  }
  onSubmit(): void {
    this.authService.register(<RegisterRequestInterface>(this.form.value)).subscribe({
      next: (currentUser) => {
        console.log('currentUser', currentUser);
        this.authService.setToken(currentUser);
        this.socketService.setupSocketConnection(currentUser);
        this.authService.setCurrentUser(currentUser);
        this.errorMessage = null;
        this.router.navigateByUrl('/');
      },
      error: (err: HttpErrorResponse) => {
        console.log('err', err.error);
        this.errorMessage = err.error.message;
        // console.log('errorMessage', this.errorMessage);

      },
    });
  }

  onTextChanged(event: any) {
    let email : string;
    email = event.target.value
    this.authService.emailAvailable(email).subscribe( (isChecked) =>  {
      // console.log(isChecked);
      if(!isChecked){
        this.errorMessage = "Email already in use";
        this.isButtonDisabled = "disabled";
        this.isButtonDisabled2 = true;

        // console.log("email exist");
      }else{
        this.errorMessage = null;
        this.isButtonDisabled = "";
        this.isButtonDisabled2 = false;

      }
    }) ;
  }


}
