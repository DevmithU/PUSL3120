import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {combineLatest, filter, finalize, map, Observable, Subject, takeUntil} from "rxjs";

import {UserListWBService} from "../../../shared/services/userListWB.service";

@Component({
  selector: 'task-modal',
  templateUrl: './userListWB.component.html',
})
export class UserListWBComponent implements OnInit,OnDestroy {
  userList: Array<string> =[];

  @HostBinding('class') classes = 'task-modal';
  whiteBoardId: string;
  unsubscribe$ = new Subject<void>();



  constructor(
    private route: ActivatedRoute,

    private router: Router,
    private userListWBService: UserListWBService,


  ) {
    console.log('userlistWB arrive04444');

    const whiteBoardId = this.route.parent?.snapshot.paramMap.get('whiteBoardId');
    if (!whiteBoardId) {
      throw new Error("Can't get whiteBoardId from URL");
    }
    this.whiteBoardId = whiteBoardId;


  }

  goToBoard(): void {
    this.router.navigate(['whiteBoard', this.whiteBoardId]);

  }
  updateUserList(): void {
    let userList = this.userList;
    let whiteBoardId = this.whiteBoardId;
    let check = { whiteBoardId, userList }
    this.userListWBService.updateUserList(whiteBoardId,userList)
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
    console.log('userlistWB arrive0');

    this.fetchData();


  }
  fetchData():void{

    this.userListWBService.getUserList(this.whiteBoardId).pipe(takeUntil(this.unsubscribe$)).subscribe((userList) => {
      this.userList = userList;


    });


  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

//dev
