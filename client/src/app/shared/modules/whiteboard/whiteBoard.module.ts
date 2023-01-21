import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TopbarModule} from "../topbar/topbar.module";
import {whiteBoardComponent} from "./components/whiteBoard.component";
import {AuthenticationGuardService} from "../../../authentication/services/authenticationGuard.service";
import {WhiteBoardService} from "../../services/whiteBoard.service";

const routes: Routes = [
  {
    path: 'whiteBoard/:whiteBoardId',
    component: whiteBoardComponent,
    canActivate: [AuthenticationGuardService],

  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), TopbarModule],
  declarations: [whiteBoardComponent],
  exports: [
    whiteBoardComponent
  ],
  providers:[WhiteBoardService],
})
export class WhiteBoardModule {}
