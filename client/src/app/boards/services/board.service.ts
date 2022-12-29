import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BoardInterface } from 'src/app/shared/types/board.interface';

@Injectable()
export class BoardService {
  board$ = new BehaviorSubject<BoardInterface | null>(null);

  setBoard(board: BoardInterface): void {
    this.board$.next(board);
  }
}
