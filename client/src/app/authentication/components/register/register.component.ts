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
  check():void{
    this.newEmail=this.form.get('email')?.toString();
    this.newUsername=this.form.get('username')?.toString();
    this.newPassword=this.form.get('password')?.toString();
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>',this.newEmail);
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>',this.newEmail?.toString());

  }
  onSubmit(): void {
    this.newEmail=this.form.get('email')?.toString();
    this.newUsername=this.form.get('username')?.toString();
    this.newPassword=this.form.get('password')?.toString();
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>',this.newEmail);

    if(typeof this.newEmail !== 'undefined' && typeof this.newUsername !== 'undefined' && typeof this.newPassword !== 'undefined'){
      this.newUser = {
        email: this.newEmail,
        username: this.newUsername,
        password: this.newPassword
      };
      console.log('22222222222222222222222222222222',this.newUser );
      console.log('22222222222222222222222222222222',this.form.value );

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
