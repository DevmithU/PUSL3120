import {Component, OnDestroy, OnInit} from '@angular/core';
import { BoardsService } from 'src/app/shared/services/boards.service';
import {BoardInterface} from "../../../shared/types/board.interface";
import {SocketService} from "../../../shared/services/socket.service";
import {SocketEventsEnum} from "../../../shared/types/socketEvents.enum";
import {Subject, takeUntil} from "rxjs";
import {AuthService} from "../../../auth/services/auth.service";

@Component({
  selector: 'boards',
  templateUrl: './boards.component.html',
})
export class BoardsComponent implements OnInit , OnDestroy{
  boards: BoardInterface[] = [] ;
  memberBoards: BoardInterface[] = [] ;
  unsubscribe$ = new Subject<void>();
  userId: string | null | undefined ;

  constructor(
    private boardsService: BoardsService,
    private socketService: SocketService,
    private authService: AuthService,

  )
  { }

  ngOnInit(): void {
    this.userId = this.authService.currentUser$.value?.id;

    this.socketService.emit(SocketEventsEnum.dashBoardJoin, {
      userId: this.userId,
    });
    this.boardsService.getBoards().subscribe((boards) => {
      console.log('boards', boards);
      this.boards = boards;
    });
    this.boardsService.getMemberBoards().subscribe((memberBoards) => {
      // console.log('boards', memberBoards);
      this.memberBoards = memberBoards;
    });
    this.initializeListeners();

  }

  createBoard(title: string): void {
    console.log('title',title);
    this.boardsService.createBoard(title).subscribe((createdBoard) => {
      this.boards = [...this.boards, createdBoard];
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
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.socketService.emit(SocketEventsEnum.dashBoardLeave, { userId: this.userId });

  }
}

