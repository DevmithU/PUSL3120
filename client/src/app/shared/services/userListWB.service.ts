import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BoardInterface } from '../types/board.interface';


@Injectable()
export class UserListWBService {
  constructor(
    private http: HttpClient,
  ) {}


  getUserList(whiteBoardId: string): Observable<Array<string>> {
    const url = environment.apiUrl + '/whiteBoard/getListUser';
    return this.http.post<Array<string>>(url, { "whiteBoardId":whiteBoardId });
  }

  updateUserList(whiteBoardId: string,userList: Array<string>): Observable<Array<string>> {
    console.log('boardId',whiteBoardId);
    console.log('userList',userList);

    const url = environment.apiUrl + '/whiteBoard/addListUser';
    let check = this.http.post<Array<string>>(url, {"whiteBoardId": whiteBoardId, "userList": userList});
    console.log('check',check)
    return check;
  }

}
