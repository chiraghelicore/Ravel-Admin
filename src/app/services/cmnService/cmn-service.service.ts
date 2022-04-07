import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CmnServiceService {

  constructor(private toastr: ToastrService) { }

  menuListIndex :number = 0;
  sideNavSwitch:boolean = false;

  showSuccess(msg:string)
  {
    this.toastr.success(msg);
  }

  showError(msg:string)
  {
    this.toastr.error(msg);
  }
}
