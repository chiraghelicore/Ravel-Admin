import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { AuthServiceService } from '../services/authService/auth-service.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe, Location } from '@angular/common';
import { CmnServiceService } from '../services/cmnService/cmn-service.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // VARIABLE DECLARATION -----------------------------------------------
  data: any;
  updateMode = false;
  // balance = true;
  userimg: any[] = [];
  profileimg: any;
  rowdata: any;
  usersData: any;
  updateReactiveForm!: FormGroup;
  totalpage = 0;
  pageSize!: number;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  next_page_url: any;
  prev_page_url: any;
  rowIndex: number[] = [];
  links:any[] = [];
  switchpage:any;
  inputvalue:string = '';

  

  range !: FormGroup ;
  username!: FormGroup;

  displayedColumns = [
    'no',
    'userid',
    'name',
    'email',
    'mobile',
    'currentamount',
    'actions',
    'delete',
  ];

  //-----------------------------------------------------------------------------

  constructor(
    private http: HttpClient,
    private _authservice: AuthServiceService,
    private _location: Location,
    public _cmnservice: CmnServiceService,
    public datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.updateMode = false;
    this._cmnservice.menuListIndex = 1;
    this.getUsers();

    this.updateReactiveForm = new FormGroup({
      firstname: new FormControl(''),
      lastname: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
      mobile: new FormControl(''),
      balance: new FormControl(),
    });

    this.range = new FormGroup({
      start: new FormControl([Validators.required]),
      end: new FormControl([Validators.required]),
    })

    this.username = new FormGroup({
      name : new FormControl(null, Validators.required)
    })

    this.range.valueChanges.subscribe(
      (res) => 
      {
        
        // console.log(res);
        let start_date = res.start;
        let end_date = res.end;

       
        
        
        if (this.range.status === 'INVALID') {
          return
        }

        else if (this.range.status === 'VALID') {
          this.convertDate(start_date,end_date)
        }
        
       
        
    })

    this.username.valueChanges.subscribe(
      (res) => 
      {
        // console.log(res);
      
      if (this.username.value.name === '') {
        window.location.reload();
      }

      else if (this.username.status === 'INVALID') { 
        return;
       }
       
        else if (this.username.status === 'VALID') {
          this.filterDataByKeyword(res);
        }
        
        
      }
    )
  }


  
  // --------------------------------------------------------------------------------

  // FUNCTIONS - METHODS --------------------------------------------------------


  convertDate(start:any,end:any)
  {
    let startdate = this.datepipe.transform(start,'dd-MM-yyyy');
    let enddate = this.datepipe.transform(end,'dd-MM-yyyy');
    

    if (startdate == null || enddate == null) {
      return;
    }
    
    this.filterDataByDate(startdate, enddate);
  }


  



  getUsers() {

    if (this.links.length >  0) {
      this.http.get(this.links[this.switchpage].url).subscribe(
        (res) => {
          console.log("Current Page Data :- ", res);
          window.scroll(  0, -400);
          this.rowdata = res;
          this.usersData = this.rowdata.data;

           // To fill dummy image, where img is null
           for (let index = 0; index < this.usersData.length; index++) {
            if (this.usersData[index].profile_pic === null) {
              this.usersData[index].profile_pic =
                '../../assets/png/profileimg.png';
            }
          }
  
          this.totalpage = this.rowdata.total;
          this.currentPage = this.rowdata.current_page;
          this.pageSize = this.rowdata.per_page;
  
           let from = this.rowdata.from;
          let to = this.rowdata.to;
  
          this.rowIndex = [];
  
          for (let index = from; index <= to; index++) {
            this.rowIndex.push(index);
          }
  
         
        },
        err => {console.log(err);
          this._cmnservice.showError(err.error.message);
        }
      );

    }


    else{

      this._authservice.getUsers().subscribe((res) => {
        console.log('initial data :-', res);
        window.scroll(  0, -400);
       
        this.rowdata = res;
        this.usersData = this.rowdata.data;
        console.table(this.usersData);
        this.currentPage = this.rowdata.current_page;
        this.links = this.rowdata.links;
        
          // To fill dummy image, where img is null
          for (let index = 0; index < this.usersData.length; index++) {
            if (this.usersData[index].profile_pic === null) {
              this.usersData[index].profile_pic =
                '../../assets/png/profileimg.png';
            }
          }
  
        this.totalpage = this.rowdata.total;
        this.currentPage = this.rowdata.current_page;
        this.pageSize = this.rowdata.per_page;
  
         let from = this.rowdata.from;
        let to = this.rowdata.to;
  
        this.rowIndex = [];
  
        for (let index = from; index <= to; index++) {
          this.rowIndex.push(index);
        }
  
             // For Pagination
             this.dataSource = new MatTableDataSource<any>(this.usersData);
             this.dataSource.paginator = this.paginator;
             console.log('datasource', this.dataSource);
     
             this.dataSource.sort = this.sort;
  
  
        // console.log("link length :", this.links);
        // console.log("current page", this.currentPage);
        
        
      },  err => {console.log(err);
        this._cmnservice.showError(err.error.message);
      })
    }

  }

  updateUser() {
    let updateUser = {
      name:
        this.updateReactiveForm.value.firstname +
        ' ' +
        this.updateReactiveForm.value.lastname,
      email: this.updateReactiveForm.value.email,
    };

    // console.log('update User Data :-', updateUser);

    this._authservice.updateUser(updateUser).subscribe(
      (res) => {
        console.log("update status -",res);
        this._cmnservice.showSuccess('User Update Successfully');
        this.updateMode = false;
    },
      err => {
        this._cmnservice.showError(err.error.data);
        console.log("Error :-", err);

        
        
      }
    )

  }


  cancelUpdateUser()
  {
   
    this.updateMode = false;
  }

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.switchpage = event.pageIndex + 1;
    this.getUsers();
  }

  filterDataByKeyword(keyword: any) {
    // console.log("filter :-", keyword);
    this.switchpage = 0;

    let data = {keyword: keyword.name}
    this._authservice.filterUser(data).subscribe(
      (res) => 
      {
        console.log('filterdata by kw -', res);
        this.rowdata = res;
        this.usersData = this.rowdata.data;
        this.totalpage = this.rowdata.total;
        this.links = this.rowdata.links;
        this.pageSize = this.rowdata.per_page;      
        this.currentPage = this.rowdata.current_page;
        

        let from = this.rowdata.from;
        let to = this.rowdata.to;

        this.rowIndex = [];

        for (let index = from; index <= to; index++) {
          this.rowIndex.push(index);
        }
        
           // To fill dummy image, where img is null
           for (let index = 0; index < this.usersData.length; index++) {
            if (this.usersData[index].profile_pic === null) {
              this.usersData[index].profile_pic =
                '../../assets/png/profileimg.png';
            }
          }
  
 
      },
      err => {console.log(err);
        this._cmnservice.showError(err.error.message);
      }
    )
  }

  filterDataByDate(start:any,end:any)
  {

    if (this.range.status === 'INVALID') {
      // console.log('Not Valid');
      return;
    }

    this.switchpage = 0;

   

      let data = {from_date: start, to_date: end}
      console.table(data);

      this._authservice.filterUser(data).subscribe(
      (res) => 
      {
        console.log('filterdata by date -', res);
        this.rowdata = res;
        this.usersData = this.rowdata.data;
        this.totalpage = this.rowdata.total;
        this.links = this.rowdata.links;
        this.pageSize = this.rowdata.per_page;      
        this.currentPage = this.rowdata.current_page;
        

        let from = this.rowdata.from;
        let to = this.rowdata.to;

        this.rowIndex = [];

        for (let index = from; index <= to; index++) {
          this.rowIndex.push(index);
        }
        
          // To fill dummy image, where img is null
          for (let index = 0; index < this.usersData.length; index++) {
            if (this.usersData[index].profile_pic === null) {
              this.usersData[index].profile_pic =
                '../../assets/png/profileimg.png';
            }
          }
  
  
      
      },
      err => {
        console.log(err);
        this._cmnservice.showError(err.error.message);
      }
      )
  }

  setInputValue(keyword:string)
  {
    this.inputvalue = keyword;
  }

  clearInput()
  {
    this.inputvalue = "";
    // console.log("clear");
    
    window.location.reload();
  }

  openUpdate(rowdata: any) {
    this.updateMode = true;
    console.log('UserId :-', rowdata);

    this.updateReactiveForm.setValue({
      firstname: rowdata.first_name,
      balance: rowdata.balance,
      email: rowdata.email,
      mobile: rowdata.mobile,
      lastname: rowdata.last_name,
      password: '',
    });

    console.log('Form :-', this.updateReactiveForm);
  }

  deleteData(rowdata: any) {
    let i = rowdata.no;

    console.log("Delet Data :-", rowdata);

    let data = {user_id: rowdata.id};

    this._authservice.deleteUser(data).subscribe(
      (res) => {console.log("delete status -",res);},
      err => {console.log(err);
        this._cmnservice.showError(err.error.message);
      }
    );
    

    console.log('finish delete function');
  }
}
