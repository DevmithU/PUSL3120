import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {BoardService} from "../../services/board.service";
import {TaskInterface} from "../../../shared/types/task.interface";
import {combineLatest, filter, map, Observable, Subject, takeUntil} from "rxjs";
import {ColumnInterface} from "../../../shared/types/column.interface";
import {FormBuilder} from "@angular/forms";
import {TasksService} from "../../../shared/services/tasks.service";
import {SocketService} from "../../../shared/services/socket.service";
import {SocketEventsEnum} from "../../../shared/types/socketEvents.enum";

@Component({
  selector: 'task-modal',
  templateUrl: './userList.component.html',
})
export class UserListComponent implements OnInit {
  @HostBinding('class') classes = 'task-modal';
  boardId: string;
  userList: string [] | undefined;


  constructor(
    private route: ActivatedRoute,

    private router: Router,


  ) {
    const boardId = this.route.parent?.snapshot.paramMap.get('boardId');
    if (!boardId) {
      throw new Error("Can't get boardID from URL");
    }
    this.boardId = boardId;


  }

  goToBoard(): void {
    this.router.navigate(['boards', this.boardId]);

  }
  updateTaskName(taskName: string): void {

  }
  updateTaskDescription(taskDescription: string): void {

  }

  deleteTask() {

  }

  ngOnInit(): void {
    const message = this.route.snapshot.queryParams['message'];
    console.log("h1")
    console.log(message);


  }
}

//dev
