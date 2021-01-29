import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { CustomersComponent } from './customers/customers.component';
import { DancerComponent } from './dancer/dancer.component';
import { ClubownerComponent } from './clubowner/clubowner.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { enableRipple } from '@syncfusion/ej2-base';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { UiSwitchModule } from 'ngx-ui-switch';

enableRipple(true);

@NgModule({
  declarations: [CustomersComponent, DancerComponent, ClubownerComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    CommonModule, 
    UiSwitchModule,
    PdfViewerModule,
    FormsModule, 
    ReactiveFormsModule,
    NgxSpinnerModule
  ]
})
export class UserModule { }
