import {Component, HostBinding, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {BoardService} from "../../services/board.service";
import {TaskInterface} from "../../../shared/types/task.interface";
import {combineLatest, filter, map, Observable, Subject, takeUntil} from "rxjs";
import {ColumnInterface} from "../../../shared/types/column.interface";
import {FormBuilder} from "@angular/forms";
import {TasksService} from "../../../shared/services/tasks.service";
import {SocketService} from "../../../shared/services/socket.service";
import {SocketEventsEnum} from "../../../shared/types/socketEvents.enum";

@Component({
  selector: 'task-modal',
  templateUrl: './taskView.component.html',
})
export class TaskViewComponent implements OnDestroy {
  @HostBinding('class') classes = 'task-modal';

  boardId: string;
  taskId: string;
  task$: Observable<TaskInterface>;
  data$: Observable<{ task: TaskInterface; columns: ColumnInterface[] }>;
  columnForm = this.fb.group({
    columnId: [null as (string | null | undefined)]
  });
  unsubscribe$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private tasksService: TasksService,
    private socketService: SocketService,

    private fb: FormBuilder
  ) {    const taskId = this.route.snapshot.paramMap.get('taskId');
    //check parent route
    const boardId = this.route.parent?.snapshot.paramMap.get('boardId');

    if (!boardId) {
      throw new Error("Can't get boardID from URL");
    }

    if (!taskId) {
      throw new Error("Can't get taskID from URL");
    }

    this.taskId = taskId;
    this.boardId = boardId;
    this.task$ = this.boardService.tasks$.pipe(
      map((tasks) => {
        return tasks.find((task) => task.id === this.taskId);
      }),
      filter(Boolean)
    );

    this.data$ = combineLatest([this.task$, this.boardService.columns$]).pipe(
      map(([task, columns]) => ({
        task,
        columns,
      }))
    );
//test
    this.task$.pipe(takeUntil(this.unsubscribe$)).subscribe((task) => {
      // console.log('here222');
      this.columnForm.patchValue({ columnId: task.columnId });
    });

    combineLatest([this.task$, this.columnForm.get('columnId')!.valueChanges])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([task, columnId]) => {
        // console.log('44444');

        if (task.columnId !== columnId) {
          this.tasksService.updateTask(this.boardId, task.id, { columnId });
        }
      });
    this.socketService
      .listen<string>(SocketEventsEnum.tasksDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.goToBoard();
      });
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  goToBoard(): void {

    this.router.navigate(['dashBoard', this.boardId]);
  }
  updateTaskName(taskName: string): void {
    this.tasksService.updateTask(this.boardId, this.taskId, {
      title: taskName,
    });  }
  updateTaskDescription(taskDescription: string): void {
    this.tasksService.updateTask(this.boardId, this.taskId, {
      description: taskDescription,
    });
  }

  deleteTask() {
    if (confirm('Are you sure you want to delete the task?')) {
      this.tasksService.deleteTask(this.boardId, this.taskId);
    }
  }

  updateTaskHasCheck(event: any):void{
    this.tasksService.updateTask(this.boardId, this.taskId, {
      hasCheck: event.target.checked
    });
  }
  updateTaskCheckStatus(event: any):void{
    this.tasksService.updateTask(this.boardId, this.taskId, {
      checkStatus: event.target.checked
    });
  }
}

//dev
