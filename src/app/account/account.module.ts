import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccountRoutingModule } from './account-routing.module';
// import { LoginComponent } from './login/login.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NgxSpinnerModule } from "ngx-spinner";


@NgModule({
  declarations: [ LoginPageComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AccountModule { }
