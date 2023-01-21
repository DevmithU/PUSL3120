import {Component, ElementRef, OnDestroy, OnInit, ViewChild,AfterViewInit} from '@angular/core';
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

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
})

// export class BoardComponent {

export class BoardComponent implements OnInit ,OnDestroy,AfterViewInit{
  @ViewChild('r1') r1: ElementRef  | undefined;


  userList: Array<string> | undefined;
  boardId: string;
  data$: Observable<{
    board: BoardInterface;
    columns: ColumnInterface[];
    tasks: TaskInterface[];

  }>;
  unsubscribe$ = new Subject<void>();
  private offset: { x: any; y: any; } | undefined;


  constructor(
    private boardsService: DashBoardService,
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private socketService: SocketService,
    private columnsService: ColumnsService,
    private tasksService: TasksService,
  ) {
    const boardId = this.route.snapshot.paramMap.get('boardId');
    if (!boardId) {
      throw new Error('Cant get boardID from url');
    }

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
    // this.data$.pipe(takeUntil(this.unsubscribe$)).subscribe(data =>{
    //   console.log("list", data.board.userList);
    //   console.log("done!!!");
    // }
    // );


  }


  ngAfterViewInit() {

    if(this.r1){


      let r1Rect = this.r1.nativeElement.getBoundingClientRect();
      this.offset = {x: r1Rect.left, y: r1Rect.top};

      // console.log('r1Rect',r1Rect);
      // console.log('r1Rect left top',{x: r1Rect.left, y: r1Rect.top});
      // console.log('r1Rect width',r1Rect.width);
      // console.log('r1Rect heigth',r1Rect.heigth);
      // console.log('width3',this.r1.nativeElement.width)
      // console.log('offset this22222222',this.offset);




    }


  }
  ngOnInit(): void {



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
      .listen<ColumnInterface>(SocketEventsEnum.columnsCreateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((column) => {
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

  }

  fetchData(): void {
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

      },
      (error) => {
        console.error(error);
        this.router.navigate(['/dashBoard']);
      });

    console.log("comleted");
  }

  // test(): void {
  //   this.socketService.emit('columns:create', {
  //     boardId: this.boardId,
  //     title: 'foo',
  //   });
  // }

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
    this.router.navigate(['dashBoard', this.boardId, 'userList', ], {queryParams: {userList: this.userList}} )
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
}
