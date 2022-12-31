import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import { BoardsService } from 'src/app/shared/services/boards.service';
import {BoardService} from "../../services/board.service";
import {BoardInterface} from "../../../shared/types/board.interface";
import {filter, Observable} from "rxjs";
import {SocketService} from "../../../shared/services/socket.service";
import {SocketEventsEnum} from "../../../shared/types/socketEvents.enum";

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
})

// export class BoardComponent {

export class BoardComponent implements OnInit {
  boardId: string;
  board$: Observable<BoardInterface>;

  constructor(
    private boardsService: BoardsService,
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private socketService: SocketService
  ) {
    const boardId = this.route.snapshot.paramMap.get('boardId');

    if (!boardId) {
      throw new Error('Cant get boardID from url');
    }

    this.boardId = boardId;
    this.board$ = this.boardService.board$.pipe(filter(Boolean));

  }

  ngOnInit(): void {
    this.socketService.emit(SocketEventsEnum.boardsJoin, {
      boardId: this.boardId,
    });
    this.fetchData();
    this.initializeListeners();

  }

  initializeListeners(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.boardService.leaveBoard(this.boardId);
      }
    });
  }

  fetchData(): void {
    this.boardsService.getBoard(this.boardId).subscribe((board) => {
      // console.log('board', board);
      this.boardService.setBoard(board);

    });
  }

}
