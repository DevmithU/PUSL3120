import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuardService } from '../authentication/services/authenticationGuard.service';
import { DashBoardService } from '../shared/services/dashBoard.service';
import { DashBoardComponent } from './components/dashBoard/dashBoard.component';
import {InlineFormModule} from "../shared/modules/inlineForm/inlineForm.module";
import {TopbarModule} from "../shared/modules/topbar/topbar.module";

const routes: Routes = [
  {
    path: 'dashBoard',
    component: DashBoardComponent,
    canActivate: [AuthenticationGuardService],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), InlineFormModule,TopbarModule,],
  declarations: [DashBoardComponent],
  providers: [DashBoardService],
})
export class DashBoardModule {}
