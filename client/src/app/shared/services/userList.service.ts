import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BoardInterface } from '../types/board.interface';


@Injectable()
export class UserListService {
  constructor(
    private http: HttpClient,
  ) {}

  // getBoards(): Observable<BoardInterface[]> {
  //   const url = environment.apiUrl + '/boards';
  //   return this.http.get<BoardInterface[]>(url);
  // }
  getBoard(boardId: string): Observable<BoardInterface> {
    const url = `${environment.apiUrl}/boards/${boardId}`;

    // console.log("board url",url);
    return this.http.get<BoardInterface>(url);
  }
  getUserList(boardId: string): Observable<Array<string>> {
    const url = environment.apiUrl + '/boards/getListUser';
    return this.http.post<Array<string>>(url, { "boardId":boardId });
  }





  updateUserList(boardId: string,userList: Array<string>): Observable<Array<string>> {
    console.log('here 222');
    console.log('boardId',boardId);
    console.log('userList',userList);
    console.log('here 333');

    const url = environment.apiUrl + '/boards/addListUser';
    let check = this.http.post<Array<string>>(url, {"boardId": boardId, "userList": userList});
    console.log('check',check)
    return check;
  }

}
