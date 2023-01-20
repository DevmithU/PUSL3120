import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TopbarModule} from "../topbar/topbar.module";
import {whiteBoardComponent} from "./components/whiteBoard.component";

const routes: Routes = [
  {
    path: 'whiteBoard',
    component: whiteBoardComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes),TopbarModule],
  declarations: [whiteBoardComponent],
})
export class whiteBoardModule {}
