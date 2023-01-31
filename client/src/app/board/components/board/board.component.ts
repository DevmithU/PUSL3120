import {Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewInit, AfterViewChecked} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import { DashBoardService } from 'src/app/shared/services/dashBoard.service';
import {BoardService} from "../../services/board.service";
import {BoardInterface} from "../../../shared/types/board.interface";
import {combineLatest, filter, map, Observable, Subject, takeUntil} from 'rxjs';
import {SocketService} from "../../../shared/services/socket.service";
import {SocketEventsEnum} from "../../../shared/types/socketEvents.enum";
import {ColumnsService} from "../../../shared/services/columns.service";
import {ColumnInterface} from "../../../shared/types/column.interface";
import {ColumnInputInterface} from "../../../shared/types/columnInput.interface";
import {TaskInterface} from "../../../shared/types/task.interface";
import {TasksService} from "../../../shared/services/tasks.service";
import {TaskInputInterface} from "../../../shared/types/taskInput.interface";
import {AuthenticationService} from "../../../authentication/services/authentication.service";
import {FormBuilder, Validators} from "@angular/forms";
import {ChatInputInterface} from "../../../shared/types/chatInput.interface";
import {ChatService} from "../../../shared/services/chat.service";
import {ChatInterface} from "../../../shared/types/chat.interface";
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
})
// export class BoardComponent {

export class BoardComponent implements OnInit ,OnDestroy,AfterViewInit,AfterViewChecked{
  @ViewChild('chatsElement') chatWindow: ElementRef | undefined;

  form = this.fb.group({
    newChat: ['', Validators.required],
  });
  userName: string | null | undefined ;
  userList: Array<string> | undefined;
  boardId: string;
  data$: Observable<{
    board: BoardInterface;
    columns: ColumnInterface[];
    tasks: TaskInterface[];

  }>;
  temp_name:string = "";
  chatList:Array<ChatInterface> | undefined;
  nameList:Array<any> =[] ;
  unsubscribe$ = new Subject<void>();
  private offset: { x: any; y: any; } | undefined;
  userId: string | undefined;
  previousHeight: number |undefined;
  showChat:boolean=true;
  showChatPlaceholder:string="<"
  constructor(
    private chatService: ChatService,
    private fb: FormBuilder,
    private boardsService: DashBoardService,
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private socketService: SocketService,
    private columnsService: ColumnsService,
    private tasksService: TasksService,
    private authService: AuthenticationService,

  ) {
    const boardId = this.route.snapshot.paramMap.get('boardId');
    if (!boardId) {
      throw new Error('Cant get boardID from url');
    }
    this.previousHeight =0;
    this.boardId = boardId;
    //combine the observable from the board service variables  to this. variables
    this.data$ = combineLatest([
      this.boardService.board$.pipe(filter(Boolean)),
      this.boardService.columns$,
      this.boardService.tasks$,
    ]).pipe(
      map(([board, columns, tasks]) => ({
        board,
        columns,
        tasks,
      }))
    );

  }


  ngAfterViewInit() {
    this.previousHeight = this.chatWindow?.nativeElement.scrollHeight;
  }
  ngAfterViewChecked(): void {
    let h:number=0;
    if(this.previousHeight){
       h = this.previousHeight ;

    }
      if (this.chatWindow?.nativeElement.scrollHeight >h) {
        this.scrollToBottom();
        this.previousHeight = this.chatWindow?.nativeElement.scrollHeight;
      }


  }

  scrollToBottom():void {
    if(this.chatWindow){
      this.chatWindow.nativeElement.scrollTop = this.chatWindow.nativeElement.scrollHeight;
    }
  }
  ngOnInit(): void {
    this.userId = this.authService.currentUser$.value?.id;
    this.userName = this.authService.currentUser$.value?.username;



    this.socketService.emit(SocketEventsEnum.boardsJoin, {
      boardId: this.boardId,
    });
    this.fetchData();
    this.initializeListeners();

  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initializeListeners(): void {
    this.router.events.subscribe((event) => {
      //                                       add this condition to not trigger leavebaord when viewing tasks, condition only checks for /dashBoard/, think of better condition
      if (event instanceof NavigationStart && !event.url.includes('/dashBoard/')) {
        this.boardService.leaveBoard(this.boardId);
      }
    });

    // will add the new column for SELF and OTHER CLIENTS though this listener
    this.socketService
      .listen<ColumnInterface>(SocketEventsEnum.columnsCreateSuccess).pipe(takeUntil(this.unsubscribe$)).subscribe((column) => {
        this.boardService.addColumn(column);
        // console.log('column',column);

      });

    this.socketService
      .listen<string>(SocketEventsEnum.columnsDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((columnId) => {
        this.boardService.deleteColumn(columnId);
      });
    // will add the new task for SELF and OTHER CLIENTS though this listener

    this.socketService
      .listen<TaskInterface>(SocketEventsEnum.tasksCreateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((task) => {
        this.boardService.addTask(task);
      });
    this.socketService
      .listen<BoardInterface>(SocketEventsEnum.boardsUpdateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((updatedBoard) => {
        this.boardService.updateBoard(updatedBoard);
      });
    this.socketService
      .listen<ColumnInterface>(SocketEventsEnum.columnsUpdateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((updatedColumn) => {
        this.boardService.updateColumn(updatedColumn);
      });
    this.socketService
      .listen<TaskInterface>(SocketEventsEnum.tasksUpdateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((updatedTask) => {
        this.boardService.updateTask(updatedTask);
      });
    this.socketService
      .listen<string>(SocketEventsEnum.tasksDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((taskId) => {
        this.boardService.deleteTask(taskId);
      });
    this.socketService
      .listen<void>(SocketEventsEnum.boardsDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.router.navigateByUrl('/dashBoard');
      });
    this.socketService
      .listen<ChatInterface>(SocketEventsEnum.newChatMessageSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((newChat) => {
        this.chatList?.push(newChat);
        this.generateNameListForNew();

        this.scrollToBottom();


        // this.scrollToBottom();
        // this.chatService.getChats(this.boardId).subscribe((chats) => {
        //   this.chatList=chats;
        // });
      });
  }
  generateNameListForNew():void{
    if(this.chatList){
      if (this.chatList[this.chatList.length-1].userId==this.chatList[this.chatList.length-2].userId){
        this.nameList?.push(0);
      }else{
        this.nameList?.push(1);
      }
    }
  }
  generateNameList():void{
    if (this.chatList){
      for (let i = 1; i < this.chatList.length; i++) {
        let chat = this.chatList[i];
        if(chat.userId==this.chatList[i-1].userId){
          this.nameList?.push(0);
        }else{
          this.nameList?.push(1);

        }
      }
    }
  }
  closeChat(): void {
    this.showChat = !this.showChat;
    if(this.showChatPlaceholder=="<"){
      this.showChatPlaceholder=">";
    }else{
      this.showChatPlaceholder="<";

    }
  }
  fetchData(): void {
    this.chatService.getChats(this.boardId).subscribe((chats) => {
        this.chatList=chats;
        this.nameList?.push(1);
        this.generateNameList();
    this.boardsService.getBoard(this.boardId).subscribe((board) => {
        this.boardService.setBoard(board);
        //cvatch the user list

        this.userList = board.userList;

        // console.log("list", board.userList);
        this.columnsService.getColumns(this.boardId).subscribe((columns) => {
          this.boardService.setColumns(columns);
        });
        this.tasksService.getTasks(this.boardId).subscribe((tasks) => {
          this.boardService.setTasks(tasks);
        });

      console.log('chat lsit',this.chatList)
    });
      },
      (error) => {
        console.error(error);
        this.router.navigate(['/dashBoard']);
      });

    console.log("completed");
  }


  onChatSubmit():void{
    // console.log('chat value',this.form.getRawValue().newChat?.toString());
    // console.log('boardID',this.boardId);
    // console.log('userID',this.userId);
    // console.log('user Name',this.userName);
    let newText = this.form.getRawValue().newChat?.toString();
    if(this.userId && newText){
      const newMessage: ChatInputInterface={
        text: newText,
        userId: this.userId,
        boardId: this.boardId,
      }
      this.chatService.sendMessage(newMessage);
      this.form.reset();

    }
  }

  createColumn(title: string): void {
    const columnInput: ColumnInputInterface = {
      title,
      boardId: this.boardId,
    };
    this.columnsService.createColumn(columnInput);

    // console.log('create column',title);
  }

  createTask(title: string, columnId: string): void {
    const taskInput: TaskInputInterface = {
      title,
      boardId: this.boardId,
      columnId,
    };
    this.tasksService.createTask(taskInput);
  }

  getTasksByColumn(columnId: string, tasks: TaskInterface[]): TaskInterface[] {
    return tasks.filter((task) => task.columnId === columnId);
  }
  updateBoardName(boardName: string): void {
    this.boardsService.updateBoard(this.boardId, { title: boardName });
  }
  gerUserList(): void {
    this.router.navigate(['dashBoard', this.boardId, 'userList',], {queryParams: {userList: this.userList}}).then(r =>{})
   }
  deleteBoard(): void {
    if (confirm('Are you sure you want to delete the board?')) {
      this.boardsService.deleteBoard(this.boardId);
    }
  }
  deleteColumn(columnId: string): void {
    if (confirm('Are you sure you want to delete the column?')) {
      this.columnsService.deleteColumn(this.boardId, columnId);
    }
  }
  updateColumnName(columnName: string, columnId: string): void {
    this.columnsService.updateColumn(this.boardId, columnId, {
      title: columnName,
    });
  }
  openTask(taskId: string): void {
    this.router.navigate(['dashBoard', this.boardId, 'tasks', taskId]);
  }

  updateTaskCheckStatus(event: any, id: string):void{
    this.tasksService.updateTask(this.boardId, id, {
      checkStatus: event.target.checked
    });
  }



}
