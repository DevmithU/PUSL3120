import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuardService } from '../authentication/services/authenticationGuard.service';
import { InlineFormModule } from '../shared/modules/inlineForm/inlineForm.module';
import { TopbarModule } from '../shared/modules/topbar/topbar.module';
import { ColumnsService } from '../shared/services/columns.service';
import { TasksService } from '../shared/services/tasks.service';
import { BoardComponent } from './components/board/board.component';
import { TaskViewComponent } from './components/taskView/taskView.component';
import { BoardService } from './services/board.service';
import {UserListComponent} from "./components/userList/userList.component";
import {UserListService} from "../shared/services/userList.service";
import {WhiteBoardModule} from "../shared/modules/whiteboard/whiteBoard.module";

const routes: Routes = [
  {
    path: 'dashBoard/:boardId',
    component: BoardComponent,
    canActivate: [AuthenticationGuardService],
    children: [
      {
        path: 'tasks/:taskId',
        component: TaskViewComponent,
      },
      {
        path: 'userList',
        component: UserListComponent,
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
    WhiteBoardModule,
  ],
  declarations: [BoardComponent, TaskViewComponent, UserListComponent],
  providers: [BoardService, ColumnsService, TasksService, UserListService],
})
export class BoardModule {}
