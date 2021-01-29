import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClubsRoutingModule } from './clubs-routing.module';
import { ClubsComponent } from './club/clubs.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatePickerModule,TimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { AgmCoreModule } from '@agm/core';
@NgModule({
  declarations: [ClubsComponent],
  imports: [
    CommonModule,
    ClubsRoutingModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,
    NgSelectModule,
    DatePickerModule,
    TimePickerModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB_dtelxfbq8bkbZCWzYTsrDqvptG2V8c4',
      libraries: ['places']
    }),
  ]
})
export class ClubsModule { }
