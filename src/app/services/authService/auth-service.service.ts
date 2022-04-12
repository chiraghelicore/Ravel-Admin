import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { BASE_URL } from 'src/app/constants/constant.config';
import { CmnServiceService } from '../cmnService/cmn-service.service';
import { ErrorService } from '../errorService/error.service';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {

  public currentUserSubject!: BehaviorSubject<any>;
  public currentUser: Observable<any> | undefined;
  
  constructor(
    private http: HttpClient,
    private _cmnservice: CmnServiceService,
    private _errorservice: ErrorService
  ) {
    let user = sessionStorage.getItem('cu_');
    // console.log("In service -",this.currentUserSubject);

    if (user) {
      this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(user));
      this.currentUser = this.currentUserSubject.asObservable();
      // console.log("After Login -", this.currentUserSubject);
    }
    else {
      this.currentUserSubject = new BehaviorSubject<any>(null);
    }
  }

  public get currentUserValue() {
    if (this.currentUserSubject){ return this.currentUserSubject?.value};
  }

// SIGN UP REQUEST.......
  signUP(data: any) {
    return this.http.post(BASE_URL + 'admin/signup', data);
  }

// SIGN IN REQUEST
  signIn(data: any) {
    return this.http.post(BASE_URL + 'admin/login', data).pipe(
      map(
      (res:any) => {
        if (res) {
         
            sessionStorage.setItem('_cu', JSON.stringify(res));

          console.log("Login Res :-", res);
        }
        
        return res;
      }
      
      ),
    
      catchError(err => {
        return this._errorservice.handleError(err) //errorservice globally banavi didhi....aa rite bija component ma use kari skay.
      })
    );

  }

// GET DASHBOARD DATA..
  getDashData()
  {
    return this.http.get(BASE_URL + 'admin/dashboard_counts');
  }


// GET CAR_PAPERS..
  getCarPapers()
  {
    return this.http.get(BASE_URL + 'admin/car-papers');
  }


// GET USER LIST REQUEST   
  getUsers()
    {
      return this.http.get(BASE_URL+'admin/users');
    }


// UPDATE USER
    updateUser(data:any)
    {
      return this.http.post(BASE_URL + 'user/update', data);
    }
  

// FILTER USER
  filterUser(data:any)
  {
    return this.http.get(BASE_URL + 'admin/users', {params : data});
  }    


// DELETE USER
    deleteUser(data:any)
    {
      return this.http.post(BASE_URL + 'delete_user', data);
    }


// GET TRANSACTION DETAILS
    getTransactionDetails()
    {
      return this.http.get(BASE_URL + 'admin/transactions');
    }


// FILTER TRANSACTION DETAILS
    filterTransaction(data:any)
    {
      return this.http.get(BASE_URL + 'admin/transactions', {params : data});
    }


// GET SUPPORT DETAILS
    getSupportDetails()
    {
      return this.http.get(BASE_URL + 'admin/support-requests')
    }

// FILTER SUPPORT DETAILS
    filterSupportData(data:any)
    {
      return this.http.get(BASE_URL + 'admin/support-requests',{params : data});
    }

// POST SUPPORT DATA
    updateSupportData(data:any)
    {
      return this.http.post(BASE_URL + 'supportRequest', data);
    }

// LOGOUT 
    logoutAdmin(data:any)
    {
      return this.http.post(BASE_URL + 'logout', data);
    }

}