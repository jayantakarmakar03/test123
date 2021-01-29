import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../authGuard/auth.guard';
import { ClubsComponent } from './club/clubs.component';

const routes: Routes = [
  { path: '', component: ClubsComponent },
  { path: 'club/:id', component: ClubsComponent, canActivate : [AuthGuard] },
  { path: 'club', component: ClubsComponent, canActivate : [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClubsRoutingModule { }
