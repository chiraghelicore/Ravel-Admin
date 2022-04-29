import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthServiceService } from '../services/authService/auth-service.service';
import { CmnServiceService } from '../services/cmnService/cmn-service.service';

@Component({
  selector: 'app-support-view-dialog',
  templateUrl: './support-view-dialog.component.html',
  styleUrls: ['./support-view-dialog.component.scss']
})
export class SupportViewDialogComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>();
  viewReactiveForm = new FormGroup({
    userid: new FormControl({ value: '', disabled: true }),
    title: new FormControl({ value: '', disabled: true }),
    error: new FormControl({ value: '', disabled: true }),
    status: new FormControl(''),
    category: new FormControl({ value: '', disabled: true }),
    attachment: new FormControl({ value: '', disabled: true }),
    trans_ref: new FormControl({ value: '', disabled: true }),
  });


  constructor(
    private _authservice: AuthServiceService,
    public _cmnservice: CmnServiceService,
    public dialogRef: MatDialogRef<SupportViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
    this.viewReactiveForm.get('userid')?.setValue(data.element.user.first_name + " " + data.element.user.last_name);
    this.viewReactiveForm.get('title')?.setValue(data.element.title);
    this.viewReactiveForm.get('error')?.setValue(data.element.description);
    this.viewReactiveForm.get('status')?.setValue(data.element.status);
    this.viewReactiveForm.get('category')?.setValue(data.element.category);
    // this.viewReactiveForm.get('description')?.setValue(data.element.description);
    this.viewReactiveForm.get('attachment')?.setValue(data.element.attachment);
    this.viewReactiveForm.get('transaction_ref')?.setValue(data.element.transaction_ref);
  }

  ngOnInit() {
  }

  onBackSupport(): void {
    this.dialogRef.close();
  }

  onSubmit(viewReactiveForm: any) {
    let data = {
      category: this.viewReactiveForm.value.category,
      title: this.viewReactiveForm.value.title,
      error: this.viewReactiveForm.value.error,
      transaction_ref: +this.viewReactiveForm.value.trans_ref,
      attachment: this.viewReactiveForm.value.attachment,
    };
    console.log('form :-', viewReactiveForm);

    console.log('submit data :-', data);

    this._authservice.updateSupportData(data).subscribe(
      (res) => {
        console.log('Update success -', res);
        this._cmnservice.showSuccess('Update Successfully');
        this.dialogRef.close('success');
      },
      (err) => {
        this._cmnservice.showError(err.error.message);
        console.log(err);
        this.dialogRef.close('error');
      }
    );
    console.log('FormData :-', viewReactiveForm);
  }
}
