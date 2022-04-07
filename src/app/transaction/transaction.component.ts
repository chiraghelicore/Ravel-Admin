import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthServiceService } from '../services/authService/auth-service.service';
import { CmnServiceService } from '../services/cmnService/cmn-service.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {
  displayedColumns = ['no', 'sendname', 'receivername', 'date', 'amount'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  data!: any;
  senderimg: any[] = [];
  receiverimg: any[] = [];
  next_page_url: any;
  prev_page_url: any;
  rowdata: any;
  transData: any;
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

  constructor(
    private _authservice: AuthServiceService,
    public _cmnservice: CmnServiceService,
    private http: HttpClient,
    public datepipe: DatePipe
  ) {}

  ngOnInit(): void {
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
      // console.log(res);
      if (this.username.value.name === '') {
        window.location.reload();
      } else if (this.username.status === 'INVALID') {
        return;
      } else if (this.username.status === 'VALID') {
        this.filterDataByKeyword(res.name);
      }
    });

    this._cmnservice.menuListIndex = 2;
  }

  convertDate(start: any, end: any) {
    let startdate = this.datepipe.transform(start, 'dd-MM-yyyy');
    let enddate = this.datepipe.transform(end, 'dd-MM-yyyy');
    console.log('start Date ', startdate, enddate);

    if (startdate == null || enddate == null) {
      return;
    }

    this.filterDataByDate(startdate, enddate);
  }

  filterDataByDate(start: any, end: any) {
    if (this.range.status === 'INVALID') {
      // console.log('Not Valid');
      return;
    }

    this.switchpage = 0;

    let data = { from_date: start, to_date: end };

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
        this._cmnservice.showError(err.error.message);
      }
    );
  }

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
        },
        (err) => {
          console.log(err);
          this._cmnservice.showError(err.error.message);
        }
      );
    } else {
      this._authservice.getTransactionDetails().subscribe(
        (res) => {
          console.log('initial data :-', res);
          this.rowdata = res;
          window.scroll(0, -400);
          this.transData = this.rowdata.data;
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
          this.dataSource = new MatTableDataSource<any>(this.transData);
          this.dataSource.paginator = this.paginator;
          console.log('datasource', this.dataSource);

          this.dataSource.sort = this.sort;

          // console.log('link length :', this.links);
          // console.log('current page', this.currentPage);
        },
        (err) => {
          console.log(err);
          this._cmnservice.showError(err.error.message);
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
        this._cmnservice.showError(err.error.message);
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
