import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClubownerComponent } from './clubowner/clubowner.component';
import { CustomersComponent } from './customers/customers.component';
import { DancerComponent } from './dancer/dancer.component';

const routes: Routes = [
  { path: '', component: CustomersComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'dancer', component: DancerComponent },
  { path: 'club-owner', component: ClubownerComponent },

  // { path: 'activities', component: ActivitiesComponent },
  // { path: 'exercises', component: ExeercisesComponent },
  // { path: 'workout-category', component: WorkoutCategoryComponent },
  // { path: 'workout', component: WorkoutComponent },
  // { path: 'trainer-list', component: TrainerManagementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
