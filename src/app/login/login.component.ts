import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthServiceService } from '../services/authService/auth-service.service';
import { CmnServiceService } from '../services/cmnService/cmn-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<string>();

  constructor(private _authservice: AuthServiceService, private _cmnservice: CmnServiceService, private router: Router) { }

  loginform!: FormGroup;
  signupform!: FormGroup;
  loginerror!:string;
  loginmode: boolean = true;

  ngOnInit(): void {

    this.loginform = new FormGroup({
      user: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(7)])
    })

    this.signupform = new FormGroup({
      fname: new FormControl('', Validators.required),
      lname: new FormControl('', Validators.required),
      mobile: new FormControl(null, Validators.required),
      email: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(7)])
    })
  }

  onModeSwitch()
  {
    this.loginmode = !this.loginmode;
  }

  onLogin(loginform:any)
  {
    console.log("Login FormData :-", loginform);
    
    let signindata = {
    "mobile" : loginform.value.user,
    "password" : loginform.value.password
    }
    

    this._authservice.signIn(signindata).subscribe(
      res => {
        console.log("Response Data from Signin Request :-",res);
       this._cmnservice.showSuccess("Login Successfully");
        this.router.navigateByUrl('dashboard');
        
      },
      err => {
        this._cmnservice.showError(err);
        console.log("Error :-", err);

        this.loginerror = err; // err value get from authService(using catherror operator)
        
      }
     
    );
    
    this.newItemEvent.emit(loginform.status);
  }


  onSignup(signupform: any)
  {
    console.log("SignUP Data :-", signupform);

    let signupdata = {
      "first_name": signupform.value.fname,
      "last_name": signupform.value.lname,
      "mobile": signupform.value.mobile,
      "email": signupform.value.email,
      "password": signupform.value.password
    }


    this._authservice.signUP(signupdata).subscribe(
      (res) => {
        console.log("Response Data from SignUp Request :-",res);
        this.router.navigateByUrl('dashboard');
        this.signupform.reset();
      }
    ); 
  }
}
