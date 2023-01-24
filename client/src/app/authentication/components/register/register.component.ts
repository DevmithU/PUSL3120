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
  newUser:RegisterRequestInterface | undefined;
  newEmail:string|undefined;
  newUsername:string|undefined;
  newPassword:string|undefined;

  errorMessage: string | null | undefined ;
  isButtonDisabled = "disabled";
  isButtonDisabled2 = true;


  form = this.fb.group({
    email: ['', Validators.required],
    username: ['', Validators.required],
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    password: ['', Validators.required],
    passwordCheck: ['', Validators.required],

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
    this.newPassword=this.form.getRawValue().password?.toString();
    if(this.newPassword==this.form.getRawValue().passwordCheck?.toString()){

      this.newEmail=this.form.getRawValue().email?.toString();
      this.newUsername=this.form.getRawValue().username?.toString();

      if(typeof this.newEmail !== 'undefined' && typeof this.newUsername !== 'undefined' && typeof this.newPassword !== 'undefined'){
        this.newUser = {
          email: this.newEmail,
          username: this.newUsername,
          password: this.newPassword
        };


        this.authService.register(<RegisterRequestInterface>(this.newUser)).subscribe({
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

    }
    else{
      this.errorMessage = "passwords don't match";
    }

  }

  onTextChanged(event: any) {
    let email : string;
    email = event.target.value
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(String(email).toLowerCase())){
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
    else{
      this.errorMessage = "Email is Incorrect";
      this.isButtonDisabled = "disabled";
      this.isButtonDisabled2 = true;
    }

  }


}
