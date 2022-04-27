import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../services/authService/auth-service.service';
import { CmnServiceService } from '../services/cmnService/cmn-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  car_papers_count: any;
  total_ghana_wallet_amount: any;
  total_nigeria_wallet_amount: any;
  total_transactions: any;
  total_users: any;
  total_wallet_amount: any
  rowdata: any;

  isLoading: boolean = false;

  constructor(public _cmnservice: CmnServiceService, private _authservice: AuthServiceService) {
    this.isLoading = true;
  }

  ngOnInit(): void {

    this._cmnservice.menuListIndex = 0;
    this.getDahsData();
    this.getCarPapers();
  }

  getDahsData() {
    this._authservice.getDashData().subscribe(
      (res) => {
        console.log("Dashboard data :-", res);
        this.rowdata = res;

        this.total_ghana_wallet_amount = this.rowdata.total_ghana_wallet_amount;
        this.total_nigeria_wallet_amount = this.rowdata.total_nigeria_wallet_amount;
        this.car_papers_count = this.rowdata.car_papers_count;
        this.total_transactions = this.rowdata.total_transactions;
        this.total_users = this.rowdata.total_users;
        this.total_wallet_amount = this.rowdata.total_wallet_amount;

        this.isLoading = false;
      },
      err => {
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

  getCarPapers() {
    this._authservice.getCarPapers().subscribe(
      (res) => {
        console.log("Car Papers", res);
        this.isLoading = false;
      },
      err => {
        console.log(err);
        if (err && err.error && err.error.message) {
          this._cmnservice.showError(err.error.message);
        } else {
          this._cmnservice.showError("Something went wrong");
        }
        this.isLoading = false;
      }
    )
  }
}