import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { CmnServiceService } from '../services/cmnService/cmn-service.service';
import { AuthServiceService } from '../services/authService/auth-service.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { SupportViewDialogComponent } from '../support-view-dialog/support-view-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
})
export class SupportComponent implements OnInit {
  displayedColumns = ['no', 'user_id', 'title', 'description', 'status', 'actions'];

  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  viewReactiveForm!: FormGroup;
  links: any[] = [];
  switchpage: any;
  rowdata: any;
  supportData: any;
  totalpage = 0;
  pageSize!: number;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  rowIndex: any[] = [];
  status = 'Pending';
  inputvalue: string = '';

  range!: FormGroup;
  username!: FormGroup;
  isLoading: boolean = false;

  constructor(
    public datepipe: DatePipe,
    public _cmnservice: CmnServiceService,
    private _authservice: AuthServiceService,
    private http: HttpClient,
    public dialog: MatDialog
  ) {
    this.isLoading = true;
  }

  ngOnInit(): void {

    this.dataSource.sort = this.sort;

    this.getSupportData();
    this.viewMode = false;
    this._cmnservice.menuListIndex = 3;

    // this.viewReactiveForm = new FormGroup({
    //   userid: new FormControl({ value: '', disabled: true }),
    //   title: new FormControl({ value: '', disabled: true }),
    //   error: new FormControl({ value: '', disabled: true }),
    //   status: new FormControl(''),
    //   category: new FormControl({ value: '', disabled: true }),
    //   attachment: new FormControl({ value: '', disabled: true }),
    //   trans_ref: new FormControl({ value: '', disabled: true }),
    // });

    this.range = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    });

    // this.range.valueChanges.subscribe((res) => {
    //   // console.log(res);

    //   let start_date = res.start;
    //   let end_date = res.end;

    //   if (this.range.status === 'INVALID') {
    //     return;
    //   } else if (this.range.status === 'VALID') {
    //     this.convertDate(start_date, end_date);
    //   }
    // });

    this.username = new FormGroup({
      name: new FormControl(null),
    });

    // this.username.valueChanges.subscribe((res) => {
    //   // console.log(res);

    //   if (this.username.value.name === '') {
    //     window.location.reload();
    //   }
    //    else if (this.username.status === 'INVALID') {
    //     return;
    //   } 
    //   else if (this.username.status === 'VALID') {
    //     this.filterDataByKeyword(res.name);
    //   }
    // });


    this.dataSource.sortingDataAccessor = (data: any, property) => {
      console.log("DATA");
      console.log(data);
      switch (property) {
        case 'first_name': return data?.first_name;
        case 'title': return data?.title;
        case 'description': return data?.description;
        case 'status': return this.status;
        default: return data[property];
      }
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  data: any;
  viewMode = false;

  // convertDate(start: any, end: any) {
  //   let startdate = this.datepipe.transform(start, 'dd-MM-yyyy');
  //   let enddate = this.datepipe.transform(end, 'dd-MM-yyyy');

  //   if (startdate == null || enddate == null) {
  //     return;
  //   }

  //   this.filterDataByDate(startdate, enddate);
  // }

  // filterDataByDate(start: any, end: any) {
  //   if (this.range.status === 'INVALID') {
  //     // console.log('Not Valid');
  //     return;
  //   }

  //   this.switchpage = 0;

  //   let data = { from_date: start, to_date: end };
  //   // console.table(data);

  //   this._authservice.filterSupportData(data).subscribe(
  //     (res) => {
  //       console.log('filterdata by kw -', res);
  //       this.rowdata = res;
  //       this.supportData = this.rowdata.data;
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

  getSupportData() {
    // this._authservice.getSupportDetails().subscribe((res) =>
    // {
    //   console.log("Support data :-", res);
    // })

    if (this.links.length > 0) {
      this.http.get(this.links[this.switchpage].url).subscribe(
        (res) => {
          console.log('Current Page Data :- ', res);
          window.scroll(0, -400);
          this.rowdata = res;
          this.supportData = this.rowdata.data;

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
      this._authservice.getSupportDetails().subscribe(
        (res) => {
          console.log('initial data :-', res);
          window.scroll(0, -400);
          this.rowdata = res;
          this.supportData = this.rowdata.data;
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
          this.dataSource = new MatTableDataSource<any>(this.supportData);
          this.dataSource.paginator = this.paginator;
          // console.log('datasource', this.dataSource);

          setTimeout(
            () =>
              (this.dataSource.sort = this.sort),
            10
          );

          this.isLoading = false;

          // console.log('link length :', this.links);
          // console.log('current page', this.currentPage);
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

    this.getSupportData();
  }

  // filterDataByKeyword(keyword: any) {
  //   // console.log('filter :-', keyword);
  //   this.switchpage = 0;

  //   let data = { keyword: keyword };
  //   this._authservice.filterSupportData(data).subscribe(
  //     (res) => {
  //       console.log('filterdata by kw -', res);
  //       this.rowdata = res;
  //       this.supportData = this.rowdata.data;
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

  setInputValue(keyword: string) {
    this.inputvalue = keyword;
  }

  clearInput() {
    this.inputvalue = '';
    // console.log('clear');

    window.location.reload();
  }

  openView(rowdata: any) {
    // this.viewMode = true;
    rowdata.status = this.status;
    console.log('rowdata :-', rowdata);

    const dialogRef = this.dialog.open(
      SupportViewDialogComponent,
      {
        autoFocus: false,
        // width: "85vw",
        data: { element: rowdata }
      }
    );

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 'success') {
        window.location.reload();
      }

    });

    // this.viewReactiveForm.setValue({
    //   userid: rowdata.user_id,
    //   title: rowdata.title,
    //   error: rowdata.description,
    //   category: rowdata.category,
    //   attachment: rowdata.attachment,
    //   trans_ref: rowdata.transaction_ref,
    //   status: this.status,
    // });
  }

  // onSubmit(viewReactiveForm: any) {
  //   let data = {
  //     category: this.viewReactiveForm.value.category,
  //     title: this.viewReactiveForm.value.title,
  //     description: this.viewReactiveForm.value.error,
  //     transaction_ref: +this.viewReactiveForm.value.trans_ref,
  //     attachment: this.viewReactiveForm.value.attachment,
  //   };
  //   console.log('form :-', viewReactiveForm);

  //   console.log('submit data :-', data);

  //   this._authservice.updateSupportData(data).subscribe(
  //     (res) => {
  //       console.log('Update success -', res);
  //       this._cmnservice.showSuccess('Update Successfully');
  //     },
  //     (err) => {
  //       this._cmnservice.showError(err.error.message);
  //       console.log(err);
  //     }
  //   );
  //   console.log('FormData :-', viewReactiveForm);
  //   this.viewMode = false;
  //   window.location.reload();
  // }

  // onBackSupport() {
  //   this.viewMode = false;
  //   window.location.reload();
  // }
}
