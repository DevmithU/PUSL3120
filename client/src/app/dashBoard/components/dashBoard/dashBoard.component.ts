import {Component, OnDestroy, OnInit} from '@angular/core';
import { DashBoardService } from 'src/app/shared/services/dashBoard.service';
import {BoardInterface} from "../../../shared/types/board.interface";
import {SocketService} from "../../../shared/services/socket.service";
import {SocketEventsEnum} from "../../../shared/types/socketEvents.enum";
import {Subject, takeUntil} from "rxjs";
import {AuthenticationService} from "../../../authentication/services/authentication.service";
import {WhiteBoardInterface} from "../../../shared/types/whiteBoard.interface";

@Component({
  selector: 'boards',
  templateUrl: './dashBoard.component.html',
})
export class DashBoardComponent implements OnInit , OnDestroy{
  dashBoard: BoardInterface[] = [] ;
  whiteBoards: WhiteBoardInterface[] = [] ;
  memberWhiteBoards: WhiteBoardInterface[] = [] ;

  memberBoards: BoardInterface[] = [] ;
  unsubscribe$ = new Subject<void>();
  userId: string | null | undefined ;

  constructor(
    private boardsService: DashBoardService,
    private socketService: SocketService,
    private authService: AuthenticationService,

  )
  { }

  ngOnInit(): void {
    this.userId = this.authService.currentUser$.value?.id;

    this.socketService.emit(SocketEventsEnum.dashBoardJoin, {
      userId: this.userId,
    });
    this.boardsService.getBoards().subscribe((boards) => {
      console.log('boards', boards);
      this.dashBoard = boards;
    });
    this.boardsService.getWhiteBoards().subscribe((whiteboards) => {
      console.log('boards', whiteboards);
      this.whiteBoards = whiteboards;
    });
    this.boardsService.getMemberBoards().subscribe((memberBoards) => {
      // console.log('dashBoard', memberBoards);
      this.memberBoards = memberBoards;
    });
    this.boardsService.getMemberWhiteBoards().subscribe((memberWhiteBoards) => {
      // console.log('dashBoard', memberBoards);
      this.memberWhiteBoards = memberWhiteBoards;
    });
    this.initializeListeners();

  }

  createBoard(title: string): void {
    console.log('title',title);
    this.boardsService.createBoard(title).subscribe((createdBoard) => {
      this.dashBoard = [...this.dashBoard, createdBoard];
    });
  }
  createWhiteBoard(title: string): void {
    console.log('title',title);
    this.boardsService.createWhiteBoard(title).subscribe((createdWhiteBoard) => {
      this.whiteBoards = [...this.whiteBoards, createdWhiteBoard];
    });
  }

  private initializeListeners(): void{
    this.socketService
      .listen<BoardInterface[]>(SocketEventsEnum.addMemberSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((newMemberBoards) => {

          this.memberBoards = newMemberBoards;
        console.log('column',newMemberBoards);

      });
    this.socketService
      .listen<WhiteBoardInterface[]>(SocketEventsEnum.addMemberSuccessWB)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((newMemberWhiteBoards) => {

        this.memberWhiteBoards = newMemberWhiteBoards;
        console.log('column',newMemberWhiteBoards);

      });

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.socketService.emit(SocketEventsEnum.dashBoardLeave, { userId: this.userId });

  }
}

