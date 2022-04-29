import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthServiceService } from '../services/authService/auth-service.service';
import { CmnServiceService } from '../services/cmnService/cmn-service.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

export interface MyFilter {
  userName: string,
  startDate: any,
  endDate: any
}


@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {
  displayedColumns = ['no', 'sendname', 'receivername', 'updated_at', 'amount'];

  dataSource!: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  data!: any;
  senderimg: any[] = [];
  receiverimg: any[] = [];
  next_page_url: any;
  prev_page_url: any;
  rowdata: any;
  transData = new MatTableDataSource<any>();
  totalpage = 0;
  pageSize!: number;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  rowIndex: any[] = [];
  links: any[] = [];
  switchpage: any;
  inputvalue: string = '';
  range!: FormGroup;
  username!: FormGroup;

  isLoading: boolean = false;

  filteredValues: MyFilter = { userName: '', startDate: null, endDate: null };

  constructor(
    private _authservice: AuthServiceService,
    public _cmnservice: CmnServiceService,
    private http: HttpClient,
    public datepipe: DatePipe
  ) {
    this.isLoading = true;
  }

  ngOnInit(): void {

    this.transData.sort = this.sort;

    // this.storedata();
    this.getTransactionDetails();

    this.range = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    });

    this.range.valueChanges.subscribe((res) => {
      // console.log(res);
      let start_date = res.start;
      let end_date = res.end;

      if (this.range.status === 'INVALID') {
        return;
      } else if (this.range.status === 'VALID') {
        this.convertDate(start_date, end_date);
      }
    });

    this.username = new FormGroup({
      name: new FormControl(null),
    });

    this.username.valueChanges.subscribe((res) => {
      console.log(res.name);
      this.filteredValues['userName'] = res.name;
      this.transData.filter = JSON.stringify(this.filteredValues);
    });
    // this.username.valueChanges.subscribe((res) => {
    //   // console.log(res);
    //   if (this.username.value.name === '') {
    //     window.location.reload();
    //   } else if (this.username.status === 'INVALID') {
    //     return;
    //   } else if (this.username.status === 'VALID') {
    //     this.filterDataByKeyword(res.name);
    //   }
    // });

    this._cmnservice.menuListIndex = 2;


    this.transData.sortingDataAccessor = (data, property) => {
      switch (property) {
        case 'no': return data.index;
        case 'sendname': return data?.from_user?.first_name;
        case 'receivername': return data.to_user?.first_name;
        case 'updated_at': return data?.updated_at;
        case 'currentamount': return data?.currentamount;
        default: return data[property];
      }
    }

    this.transData.filterPredicate = this.customFilterPredicate();

    // this.transData.filterPredicate = (data: any, filter: any) => !filter || filter.startDate < data.updated_at && filter.endDate > data.updated_at;
  }


  customFilterPredicate() {
    return (data: any, filter: string): boolean => {

      let searchString = JSON.parse(filter) as MyFilter;

      if ((searchString.startDate && searchString.startDate !== '') && (searchString.endDate && searchString.endDate != '')) {

        let formatedUpdateDate = data.updated_at;
        formatedUpdateDate = this.datepipe.transform(data.updated_at, 'dd-MM-yyyy');

        // (data.from_user?.first_name.toString().trim().toLowerCase().startsWith(searchString.userName.trim().toLowerCase())) || 
        // (data.to_user?.first_name.toString().trim().toLowerCase().startsWith(searchString.userName.toLowerCase()))
        return (formatedUpdateDate > searchString.startDate) && (formatedUpdateDate < searchString.endDate)
        //   ||
        //   (data.from_user?.first_name.toString().trim().toLowerCase().startsWith(searchString.userName.trim().toLowerCase())) || 
        // (data.to_user?.first_name.toString().trim().toLowerCase().startsWith(searchString.userName.toLowerCase()));

      } else {
        return (data.from_user?.first_name.toString().trim().toLowerCase().startsWith(searchString.userName.trim().toLowerCase())) ||
          (data.to_user?.first_name.toString().trim().toLowerCase().startsWith(searchString.userName.toLowerCase()))
      }
    }
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.transData.filter = filterValue.trim().toLowerCase();

  //   console.log(this.transData.filter  = filterValue.trim().toLowerCase());
  // }

  convertDate(start: any, end: any) {
    let startdate = this.datepipe.transform(start, 'dd-MM-yyyy');
    let enddate = this.datepipe.transform(end, 'dd-MM-yyyy');
    console.log('start Date ', startdate, enddate);

    if (startdate == null || enddate == null) {
      return;
    }
    this.filteredValues['startDate'] = startdate;
    this.filteredValues['endDate'] = enddate;

    this.transData.filter = JSON.stringify(this.filteredValues);
  }

  // filterDataByDate(start: any, end: any) {
  //   if (this.range.status === 'INVALID') {
  //     // console.log('Not Valid');
  //     return;
  //   }

  //   this.switchpage = 0;

  //   let data = { from_date: start, to_date: end };

  //   this._authservice.filterTransaction(data).subscribe(
  //     (res) => {
  //       console.log('filterdata by kw -', res);
  //       this.rowdata = res;
  //       this.transData = this.rowdata.data;
  //       this.totalpage = this.rowdata.total;
  //       this.links = this.rowdata.links;
  //       this.pageSize = this.rowdata.per_page;      
  //       this.currentPage = this.rowdata.current_page;


  //       let from = this.rowdata.from;
  //       let to = this.rowdata.to;

  //       this.rowIndex = [];

  //       for (let index = from; index <= to; index++) {
  //         this.rowIndex.push(index);
  //       }
  //     },
  //     (err) => {
  //       console.log(err);
  //       this._cmnservice.showError(err.error.message);
  //     }
  //   );
  // }

  getTransactionDetails() {
    if (this.links.length > 0) {
      this.http.get(this.links[this.switchpage].url).subscribe(
        (res) => {
          console.log('Current Page Data :- ', res);
          this.rowdata = res;
          window.scroll(0, -400);
          this.transData = this.rowdata.data;

          this.totalpage = this.rowdata.total;
          this.currentPage = this.rowdata.current_page;
          this.pageSize = this.rowdata.per_page;

          let from = this.rowdata.from;
          let to = this.rowdata.to;

          this.rowIndex = [];

          for (let index = from; index <= to; index++) {
            this.rowIndex.push(index);
          }

          this.isLoading = false;
        },
        (err) => {
          console.log(err);
          if (err && err.error && err.error.message) {
            this._cmnservice.showError(err.error.message);
          } else {
            this._cmnservice.showError("Something went wrong");
          }
          this.isLoading = false;
        }
      );
    } else {
      this._authservice.getTransactionDetails().subscribe(
        (res) => {
          this.isLoading = false;
          console.log('initial data :-', res);
          this.rowdata = res;
          window.scroll(0, -400);
          this.transData.data = this.rowdata.data;
          this.currentPage = this.rowdata.current_page;
          this.links = this.rowdata.links;

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
          this.dataSource = new MatTableDataSource<any>(this.transData.data);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort


          this.transData.paginator = this.paginator;
          this.transData.sort = this.sort;

          setTimeout(
            () =>
              (this.transData.sort = this.sort),
            10
          );

          this.isLoading = false;
        },
        (err) => {
          console.log(err);
          if (err && err.error && err.error.message) {
            this._cmnservice.showError(err.error.message);
          } else {
            this._cmnservice.showError("Something went wrong");
          }
          this.isLoading = false;
        }
      );
    }
  }

  pageChanged(event: PageEvent) {

    console.log({ event });
    this.switchpage = event.pageIndex + 1;

    this.getTransactionDetails();
  }

  filterDataByKeyword(keyword: any) {
    // console.log('filter :-', keyword);
    this.switchpage = 0;

    let data = { keyword: keyword };
    this._authservice.filterTransaction(data).subscribe(
      (res) => {
        console.log('filterdata by kw -', res);
        this.rowdata = res;
        this.transData = this.rowdata.data;
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
      },
      (err) => {
        console.log(err);
        if (err && err.error && err.error.message) {
          this._cmnservice.showError(err.error.message);
        } else {
          this._cmnservice.showError("Something went wrong");
        }
      }
    );
  }

  setInputValue(keyword: string) {
    this.inputvalue = keyword;
  }

  clearInput() {
    this.inputvalue = '';
    // console.log('clear');

    window.location.reload();
  }


}
