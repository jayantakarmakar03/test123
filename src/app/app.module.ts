import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ActivateAccountComponent } from './activate-account/activate-account.component';
import { ResetUserPasswordComponent } from './reset-user-password/reset-user-password.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AgmCoreModule } from '@agm/core';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ActivateAccountComponent,
    ResetUserPasswordComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    NgSelectModule,
    PdfViewerModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,

    ToastrModule.forRoot(),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB_dtelxfbq8bkbZCWzYTsrDqvptG2V8c4',
      libraries: ['places']
    }),
  ],
  providers: [ToastrModule],
  bootstrap: [AppComponent]
})
export class AppModule { }

