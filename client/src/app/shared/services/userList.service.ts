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

  getUserList(boardId: string): Observable<Array<string>> {
    const url = environment.apiUrl + '/dashBoard/getListUser';
    return this.http.post<Array<string>>(url, { "boardId":boardId });
  }





  updateUserList(boardId: string,userList: Array<string>): Observable<Array<string>> {
    console.log('boardId',boardId);
    console.log('userList',userList);
    const url = environment.apiUrl + '/dashBoard/addListUser';
    let check = this.http.post<Array<string>>(url, {"boardId": boardId, "userList": userList});
    console.log('check',check)
    return check;
  }

}
