import { Component, ViewChild, ElementRef, AfterViewInit,OnInit } from '@angular/core';
import {SocketEventsEnum} from "../../../shared/types/socketEvents.enum";
import {SocketService} from "../../../shared/services/socket.service";
import {AuthenticationService} from "../../../authentication/services/authentication.service";
import {Subject, takeUntil} from "rxjs";
import {ActivatedRoute, NavigationStart, Router} from "@angular/router";
import {WhiteBoardService} from "../../services/whiteBoard.service";
import {WhiteBoardInterface} from "../../../shared/types/whiteBoard.interface";


@Component({
  selector: 'whiteBoard',
  templateUrl: './whiteBoard.component.html',
})
export class whiteBoardComponent implements OnInit,AfterViewInit {
  userList: Array<string> | undefined;

  unsubscribe$ = new Subject<void>();
  X_page: any | null;
  Y_page: any | null;
  X_client: any | null;
  Y_client: any | null;
  wb_top: any | null;
  wb_left: any | null;
  wb_hiegt: any | null;
  wb_width: any | null;
  x_cal: any | null;
  y_cal: any | null;
  divBlack: string = "selected-pen";
  divRed: string = "";
  divErase: string = "";
  whiteBoard: WhiteBoardInterface | undefined ;
  WBtitle:string ="Sample Board"


  @ViewChild('myCanvas') canvas: ElementRef | null;
  @ViewChild('WBback') WBback: ElementRef | null | undefined;
  private ctx: CanvasRenderingContext2D | null;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;
  private offset: { x: any; y: any; } | undefined;
  userId: string | null | undefined;
  whiteBoardId: string;
  strColor: string = '#000000';
  strWidth: number = 8;

  constructor(
    private whiteBoardService : WhiteBoardService,
    private socketService: SocketService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    const whiteBoardId = this.route.snapshot.paramMap.get('whiteBoardId');
    if (!whiteBoardId) {
      throw new Error('Cant get whiteBoardId from url');
    }
    this.whiteBoardId = whiteBoardId;
    console.log('WB id', this.whiteBoardId)
    this.ctx = null;
    this.canvas = null;
    console.log('width1', this.WBback?.nativeElement)
  }

  ngOnInit(): void {
    console.log('WB id', this.whiteBoardId)
    this.userId = this.authService.currentUser$.value?.id;

    this.socketService.emit(SocketEventsEnum.whiteBoardJoin, {
      whiteBoardId: this.whiteBoardId,
    });
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    }

    this.fetchData();

    this.initializeListeners();

  }

  ngOnDestroy(): void {
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    }
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.socketService.emit(SocketEventsEnum.whiteBoardLeave, {
      whiteBoardId: this.whiteBoardId,
    });

  }
  check():void{
    this.ctx = this.canvas?.nativeElement.getContext('2d');

  }

  ngAfterViewInit(): void {

    if (this.canvas && this.WBback) {
      console.log('width3', this.WBback.nativeElement.width)

      let wbRect = this.WBback.nativeElement.getBoundingClientRect();
      this.canvas.nativeElement.width = wbRect.width*4;
      this.canvas.nativeElement.height = wbRect.height*4;
      this.ctx = this.canvas?.nativeElement.getContext('2d');
      this.offset = {x: wbRect.left, y: wbRect.top};
      // this.offset = {x: wbRect.left, y: 560.667+40};

      this.wb_left = wbRect.left;
      this.wb_top = wbRect.top;
      this.wb_hiegt = wbRect.height;
      this.wb_width = wbRect.width;

      console.log('wbrect', wbRect);
      console.log('offset this', this.offset);


    }

  }

  logPoint(event: MouseEvent): void {
    this.X_page = event.pageX;
    this.Y_page = event.pageY;
    this.X_client = event.clientX;
    this.Y_client = event.clientY;
    this.x_cal = event.pageX - this.offset?.x;
    this.y_cal = event.pageY - this.offset?.y;
  }

  startDrawing(event: MouseEvent): void {
    this.X_page = event.pageX;
    this.Y_page = event.pageY;
    this.X_client = event.clientX;
    this.Y_client = event.clientY;
    this.x_cal = event.pageX - this.offset?.x;
    this.y_cal = event.pageY - this.offset?.y;

    this.isDrawing = true;
    let coordinates = {x:4*( event.pageX - this.offset?.x), y:4*( event.pageY - this.offset?.y)};

    // let coordinates = {x: event.pageX, y: event.pageY};
    // if (window.scrollY>0){
    //   coordinates = {x: event.pageX - this.offset?.x, y: event.pageY- this.offset?.y - window.scrollY};
    // }
    this.socketService.emit(SocketEventsEnum.mouseDown, {userId: this.userId,
      whiteBoardId: this.whiteBoardId,
      x: coordinates.x,
      y: coordinates.y
    });

    this.lastX = coordinates.x;
    this.lastY = coordinates.y;
  }

  drawLine(event: MouseEvent): void {
    // console.log('scroll window',window.scrollX, window.scrollY)
    let coordinates;
    if (!this.isDrawing) {
      return;
    }
    if (this.ctx) {
      // console.log("block activated333");
      coordinates = {x:4*( event.pageX - this.offset?.x), y:4*( event.pageY - this.offset?.y)};

      // coordinates = {x: event.pageX, y: event.pageY};
      // if (window.scrollY>0){
      //   coordinates = {x: event.pageX - this.offset?.x, y: event.pageY- this.offset?.y - window.scrollY};
      // }
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      // console.log('event check 435///////////////////////////////////////////////////')
      this.socketService.emit(SocketEventsEnum.drawdone, {
        userId: this.userId,
        whiteBoardId: this.whiteBoardId,
        x: coordinates.x,
        y: coordinates.y,
        strColor: this.strColor,
        strWidth: this.strWidth,
      });
      this.ctx.lineTo(coordinates.x, coordinates.y);
      this.ctx.lineCap = "round";
      this.ctx.lineJoin = "round";
      this.ctx.strokeStyle = this.strColor;
      this.ctx.lineWidth = this.strWidth;
      this.ctx.stroke();
    }
    if (coordinates) {
      this.lastX = coordinates?.x;
      this.lastY = coordinates?.y;
    }
  }

  stopDrawing(): void {
    this.isDrawing = false;
  }


  private initializeListeners(): void {
    this.socketService.listen(SocketEventsEnum.ondraw).pipe(takeUntil(this.unsubscribe$))
      .subscribe((message: any) => {

        if(!(this.userId==message.userId)){
          var newX = message.x;
          var newY = message.y;
          var newstrColor = message.strColor;
          var newstrWidth = message.strWidth;
          let coordinates;
          //        if(!this.isDrawing && !(message.userId==this.userId)){
          if (!this.isDrawing) {

            // coordinates = {x: newX - this.offset?.x, y: newY - this.offset?.y};
            //
            // this.lastX = coordinates.x;
            // this.lastY = coordinates.y;
            /////////////end of start
            if (this.ctx) {
              // coordinates = {x: newX - this.offset?.x, y: newY - this.offset?.y};
              coordinates = {x: newX, y: newY};
              this.ctx.beginPath();
              this.ctx.moveTo(this.lastX, this.lastY);
              this.ctx.lineTo(coordinates.x, coordinates.y);
              this.ctx.lineCap = "round";
              this.ctx.lineJoin = "round";
              this.ctx.strokeStyle = newstrColor;
              this.ctx.lineWidth = newstrWidth;
              this.ctx.stroke();
            }
            if (coordinates) {
              this.lastX = coordinates?.x;
              this.lastY = coordinates?.y;
            }
            //////////////////end of draw
            console.log("whiteBoardId: ", message.whiteBoardId);
            console.log("x: ", message.x);
            console.log("y: ", message.y);
            console.log(this.isDrawing);
          }
        }



      });


    this.socketService.listen(SocketEventsEnum.mouseDownReceive).pipe(takeUntil(this.unsubscribe$))
      .subscribe((message: any) => {
        if(!(this.userId == message.userId)){
          var newX = message.x;
          var newY = message.y;
          if (!this.isDrawing) {
            this.lastX = newX;
            this.lastY = newY;
          }
        }
      });
    this.router.events.subscribe((event) => {
      //                                       add this condition to not trigger leavebaord when viewing tasks, condition only checks for /dashBoard/, think of better condition
      if (event instanceof NavigationStart && !event.url.includes('/whiteBoard/')) {
        this.socketService.emit(SocketEventsEnum.whiteBoardLeave, {
          whiteBoardId: this.whiteBoardId,
        });
      }
    });
    this.socketService
      .listen<WhiteBoardInterface>(SocketEventsEnum.whiteboardsUpdateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((updatedWhiteBoard) => {
        this.WBtitle=updatedWhiteBoard.title;
        //this.whiteBoardService.updateBoard(updatedBoard);
      });

  }
  fetchData(): void {
    this.whiteBoardService.getWhiteBoard(this.whiteBoardId).subscribe((whiteBoard) => {
      this.whiteBoard = whiteBoard;
      this.userList = whiteBoard.userList;
      this.WBtitle = whiteBoard.title;
    });

  }

  penBlack():void{
    this.strColor = '#000000';
    this.strWidth = 8;
    this.divBlack = "selected-pen";
    this.divRed = "";
    this.divErase = "";

  }
  penRed():void{
    this.strColor = '#ff0000';
    this.strWidth = 8;
    this.divBlack = "";
    this.divRed = "selected-pen";
    this.divErase = "";
  }
  penErase():void{
    this.strColor = '#ffffff';
    this.strWidth = 16;
    this.divBlack = "";
    this.divRed = "selected-pen";
    this.divErase = "";
  }

  gerUserList(): void {
    console.log('tis block')
    this.router.navigate(['whiteBoard', this.whiteBoardId, 'userListWB',], {queryParams: {userList: this.userList}} )
  }

  // updateBoardName(whiteboardName: string): void {
  //   this.whiteBoardService.updateBoard(this.whiteBoardId, { title: whiteboardName });
  // }
  updateBoardName(whiteBoardName: string): void {
    this.whiteBoardService.updateWhiteBoard(this.whiteBoardId, { title: whiteBoardName });
  }


}
