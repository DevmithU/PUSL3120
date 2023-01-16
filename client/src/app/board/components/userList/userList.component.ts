import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {BoardService} from "../../services/board.service";
import {TaskInterface} from "../../../shared/types/task.interface";
import {combineLatest, filter, finalize, map, Observable, Subject, takeUntil} from "rxjs";
import {ColumnInterface} from "../../../shared/types/column.interface";
import {FormBuilder} from "@angular/forms";
import {TasksService} from "../../../shared/services/tasks.service";
import {SocketService} from "../../../shared/services/socket.service";
import {SocketEventsEnum} from "../../../shared/types/socketEvents.enum";
import {UserListService} from "../../../shared/services/userList.service";
import {BoardInterface} from "../../../shared/types/board.interface";

@Component({
  selector: 'task-modal',
  templateUrl: './userList.component.html',
})
export class UserListComponent implements OnInit,OnDestroy {
  userList: Array<string> =[];

  @HostBinding('class') classes = 'task-modal';
  boardId: string;
  unsubscribe$ = new Subject<void>();



  constructor(
    private route: ActivatedRoute,

    private router: Router,
    private userListService: UserListService,


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
  updateUserList(): void {
    let userList = this.userList;
    let boardId = this.boardId;
    let check = { boardId, userList }
    this.userListService.updateUserList(boardId,userList)
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => this.goToBoard())
      )
      .subscribe((userList) => {
        this.userList = userList;
      });
  }
  addUserEmail(newUserEmail: string): void {


    this.userList.push(newUserEmail);

  }


  removeUser(userEmail: string): void {
    this.userList = this.userList.filter(user => user !== userEmail);
  }



  ngOnInit(): void {

    this.fetchData();


  }
  fetchData():void{

    this.userListService.getUserList(this.boardId).pipe(takeUntil(this.unsubscribe$)).subscribe((userList) => {
      this.userList = userList;


    });


  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

//dev
