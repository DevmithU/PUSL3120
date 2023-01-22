import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TopbarModule} from "../shared/modules/topbar/topbar.module";
import {whiteBoardComponent} from "./components/whiteboard/whiteBoard.component";
import {AuthenticationGuardService} from "../authentication/services/authenticationGuard.service";
import {WhiteBoardService} from "./services/whiteBoard.service";
import {InlineFormModule} from "../shared/modules/inlineForm/inlineForm.module";
import {UserListWBService} from "../shared/services/userListWB.service";
import {ReactiveFormsModule} from "@angular/forms";
import {UserListWBComponent} from "./components/userListWB/userListWB.component";

const routes: Routes = [
  {
    path: 'whiteBoard/:whiteBoardId',
    component: whiteBoardComponent,
    canActivate: [AuthenticationGuardService],
    children:[
      {
        path: 'userListWB',
        component: UserListWBComponent,
      },

    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TopbarModule,
    InlineFormModule,
    ReactiveFormsModule,
  ],
  declarations: [whiteBoardComponent,UserListWBComponent,],

  providers:[WhiteBoardService,UserListWBService],
})
export class WhiteBoardModule {}
