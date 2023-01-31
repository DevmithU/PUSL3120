import {HttpClient} from "@angular/common/http";
import {SocketService} from "./socket.service";
import {ChatInputInterface} from "../types/chatInput.interface";
import {Injectable} from "@angular/core";
import {SocketEventsEnum} from "../types/socketEvents.enum";
import {Observable} from "rxjs";
import {ColumnInterface} from "../types/column.interface";
import {environment} from "../../../environments/environment";
import {ChatInterface} from "../types/chat.interface";

@Injectable()

export class ChatService{
  constructor(private http: HttpClient, private socketService: SocketService) {}

  sendMessage(newMessage:ChatInputInterface):void{
    console.log('newMessage',newMessage);
    this.socketService.emit(SocketEventsEnum.newChatMessage,newMessage)
  }

  getChats(boardId: string): Observable<ChatInterface[]> {
    const url = `${environment.apiUrl}/chat/${boardId}`;
    return this.http.get<ChatInterface[]>(url);
  }


}
