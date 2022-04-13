import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { TransactionComponent } from './transaction/transaction.component';
import { SupportComponent } from './support/support.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { HttpInterceptorInterceptor } from './intercepter/http-interceptor.interceptor';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';
import { AuthguardGuard } from './guards/authguard.guard';
import { DatePipe } from '@angular/common';
import { MaterialModule } from './material.module';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { SupportViewDialogComponent } from './support-view-dialog/support-view-dialog.component';
import { UsersUpdateDialogComponent } from './users-update-dialog/users-update-dialog.component';




const appRoutes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  { path: 'dashboard', canActivate: [AuthguardGuard] , component: DashboardComponent },
  { path: 'users', canActivate: [AuthguardGuard] , component: UsersComponent },
  { path: 'transaction', canActivate: [AuthguardGuard] ,component: TransactionComponent },
  {path:'support', canActivate: [AuthguardGuard] ,component: SupportComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    DashboardComponent,
    UsersComponent,
    TransactionComponent,
    SupportComponent,
    HeaderComponent,
    LoginComponent,
    ConfirmationDialogComponent,
    SupportViewDialogComponent,
    UsersUpdateDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    NgxUiLoaderModule,
    ToastrModule.forRoot(),
    NgxUiLoaderHttpModule.forRoot({showForeground:true}),
    ToastrModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    MaterialModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorInterceptor,
      multi: true
    },
    AuthguardGuard,
    DatePipe
  ],
  exports: [
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
