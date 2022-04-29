import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthServiceService } from '../services/authService/auth-service.service';
import { CmnServiceService } from '../services/cmnService/cmn-service.service';

@Component({
  selector: 'app-users-update-dialog',
  templateUrl: './users-update-dialog.component.html',
  styleUrls: ['./users-update-dialog.component.scss']
})
export class UsersUpdateDialogComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>();
  updateReactiveForm = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    mobile: new FormControl(''),
    balance: new FormControl(),
  });

  constructor(
    private _authservice: AuthServiceService,
    public _cmnservice: CmnServiceService,
    public dialogRef: MatDialogRef<UsersUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
    this.updateReactiveForm.get('firstname')?.setValue(data?.element?.first_name);
    this.updateReactiveForm.get('lastname')?.setValue(data?.element?.last_name);
    this.updateReactiveForm.get('email')?.setValue(data?.element?.email);
    this.updateReactiveForm.get('password')?.setValue(data?.element?.password);
    this.updateReactiveForm.get('mobile')?.setValue(data?.element?.mobile);
    this.updateReactiveForm.get('balance')?.setValue(data?.element?.balance);
  }

  ngOnInit() {
  }

  cancelUpdateUser(): void {
    this.dialogRef.close();
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
        console.log("update status -", res);
        this._cmnservice.showSuccess('User Update Successfully');
        this.dialogRef.close('success');
      },
      err => {
        this._cmnservice.showError(err.error.data);
        console.log("Error :-", err);
        this.dialogRef.close('error');
      }
    )

  }

}
