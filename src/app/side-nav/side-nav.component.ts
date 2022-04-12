import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../services/authService/auth-service.service';
import { CmnServiceService } from '../services/cmnService/cmn-service.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  
  constructor(private _authservice: AuthServiceService, public _cmnservice: CmnServiceService) {}

  ngOnInit(): void {}

  logout()
  {
    let data = sessionStorage.getItem('_cu');
    if (confirm('Do you want to Logout ?')) {
      this._authservice.logoutAdmin(data).subscribe(
        (res) => {
          console.log(res);
          this._cmnservice.showSuccess("Logout Success");
          sessionStorage.clear();
          window.location.reload(); 
          
        },
        err => {console.log(err);
  
          this._cmnservice.showError(err);
        }
      )
    } 
  }

 sideNavSwitch()
 {
   this._cmnservice.sideNavSwitch = true;
 }

 closeNavSwitch()
 {
  this._cmnservice.sideNavSwitch = false;
 }
 

  switchMenuItem(id: number) {

  
    this._cmnservice.menuListIndex = id;

    console.log("menulist :-", this._cmnservice.menuListIndex);
  }
}