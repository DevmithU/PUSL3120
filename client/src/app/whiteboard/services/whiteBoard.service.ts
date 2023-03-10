import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {SocketEventsEnum} from "../../shared/types/socketEvents.enum";
import {SocketService} from "../../shared/services/socket.service";
import {WhiteBoardInterface} from "../../shared/types/whiteBoard.interface";

@Injectable()
export class WhiteBoardService {
  constructor(
    private http: HttpClient,
    private socketService: SocketService
  ) {}


  getWhiteBoard(whiteBoardId: string): Observable<WhiteBoardInterface> {
    const url = `${environment.apiUrl}/whiteBoards/${whiteBoardId}`;

    // console.log("board url",url);
    return this.http.get<WhiteBoardInterface>(url);
  }

  updateWhiteBoard(whiteBoardId: string, fields: { title: string }): void {
    this.socketService.emit(SocketEventsEnum.whiteboardsUpdate, { whiteBoardId, fields });
  }
  deleteBoard(boardId: string): void {
    this.socketService.emit(SocketEventsEnum.boardsDelete, { boardId });
  }

}
