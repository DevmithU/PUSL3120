import {Component, ViewChild, ElementRef, AfterViewInit, OnInit, HostListener} from '@angular/core';
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
  private _event: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this._event = event;
    console.log(event)
    console.log(`Scroll position: ${window.scrollY}`);
    let scrollY = window.scrollY;
    this.scrollTest= scrollY;
    this.resetOffset(scrollY);
  }
  dataURL:any|undefined;
  userList: Array<string> | undefined;
  dev_tools_view:boolean;
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
  @ViewChild('colorpicker') colorPicker: ElementRef | null | undefined;
  @ViewChild('widthSelector') widthSelector: ElementRef | null | undefined;

  private ctx: CanvasRenderingContext2D | null;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;
  offset= { x: 0, y: 0, } ;
  offset_test= { x: 0, y: 0, } ;
  userId: string | null | undefined;
  whiteBoardId: string;
  strColor: string = '#000000';
  strWidth: number = 8;
  scrollTest:any
  constructor(
    private whiteBoardService : WhiteBoardService,
    private socketService: SocketService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.dev_tools_view=false;
    this.scrollTest=0;
    this.offset= { x: 0, y: 0, } ;
    this.offset_test= { x: 0, y: 0, } ;
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

  resetOffset(scrollY: number):void{
    console.log('reset/////////////////////////////////////////')

    if (this.canvas && this.WBback) {
      console.log('reset/////////////', this.WBback.nativeElement.width)

      let wbRect = this.WBback.nativeElement.getBoundingClientRect();

      this.offset = {x: wbRect.left, y: wbRect.top};
      this.offset_test = {x: wbRect.left, y: wbRect.top};
      if(this.offset_test.y<0){
      }
      // this.offset = {x: wbRect.left, y: 560.667+40};

      this.wb_left = wbRect.left;
      this.wb_top = wbRect.top;
      this.wb_hiegt = wbRect.height;
      this.wb_width = wbRect.width;

      console.log('wbrect', wbRect);
      console.log('offset this', this.offset);


    }

  }
  ngAfterViewInit(): void {

    if (this.canvas && this.WBback) {
      console.log('width3', this.WBback.nativeElement.width)

      let wbRect = this.WBback.nativeElement.getBoundingClientRect();
      this.canvas.nativeElement.width = wbRect.width*4;
      this.canvas.nativeElement.height = wbRect.height*4;
      this.ctx = this.canvas?.nativeElement.getContext('2d');
      this.offset = {x: wbRect.left, y: wbRect.top};
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
  startDrawingCommon(pageX :any,pageY:any,clientX:any,clientY :any):void{
    this.X_page = pageX;
    this.Y_page = pageY;
    this.X_client = clientX;
    this.Y_client = clientY;
    this.x_cal = pageX - this.offset?.x;
    this.y_cal = pageY - this.offset?.y;

    this.isDrawing = true;
    let coordinates = {x:4*( pageX - this.offset?.x), y:4*( pageY - this.offset?.y-this.scrollTest)};

    this.socketService.emit(SocketEventsEnum.mouseDown, {userId: this.userId,
      whiteBoardId: this.whiteBoardId,
      x: coordinates.x,
      y: coordinates.y
    });

    this.lastX = coordinates.x;
    this.lastY = coordinates.y;

  }


  startDrawing(event: MouseEvent): void {
    this.startDrawingCommon(
      event.pageX,
      event.pageY,
      event.clientX,
      event.clientY);
  }
  drawLine(event: MouseEvent): void {
    this.drawLineCommon(event.pageX,event.pageY);
  }


  startDrawingTouch(event: TouchEvent): void {
    event.preventDefault();
    this.startDrawingCommon(
      event.touches[0].pageX,
      event.touches[0].pageY,
      event.touches[0].clientX,
      event.touches[0].clientY);
  }

  drawLineTouch(event: TouchEvent): void {
    event.preventDefault();
    this.drawLineCommon(event.touches[0].pageX,event.touches[0].pageY);
  }
  clearBoard(): void {
    this.dataURL = this.canvas?.nativeElement.toDataURL()
    console.log('dataurl');
    console.log(typeof this.dataURL);
    console.log(this.dataURL);

    this.ctx?.clearRect(0, 0, this.canvas?.nativeElement.width, this.canvas?.nativeElement.height);
  }

  restoreBoard(): void {
    var img = new Image();
    img.src = this.dataURL;
    img.onload = () => {
      this.ctx?.drawImage(img, 0, 0);
    }
  }

  stopDrawing(): void {
    this.isDrawing = false;
  }

  drawLineCommon(x: any,y: any):void{
    let coordinates;
    if (!this.isDrawing) {
      return;
    }
    if (this.ctx) {
      coordinates = {x:4*( x - this.offset?.x), y:4*( y - this.offset?.y-this.scrollTest)};
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);

      this.ctx.lineTo(coordinates.x, coordinates.y);
      this.ctx.lineCap = "round";
      this.ctx.lineJoin = "round";
      this.ctx.strokeStyle = this.strColor;
      this.ctx.lineWidth = this.strWidth;
      this.ctx.stroke();

      this.socketService.emit(SocketEventsEnum.drawdone, {
        userId: this.userId,
        whiteBoardId: this.whiteBoardId,
        x: coordinates.x,
        y: coordinates.y,
        strColor: this.strColor,
        strWidth: this.strWidth,
      });
    }
    if (coordinates) {
      this.lastX = coordinates?.x;
      this.lastY = coordinates?.y;
    }

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
          if (!this.isDrawing) {


            if (this.ctx) {
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
    this.strWidth = 166;
    this.divBlack = "";
    this.divRed = "selected-pen";
    this.divErase = "";
  }
  changeWidth():void{
    this.strWidth=this.widthSelector?.nativeElement.value;
    // console.log(this.colorPicker?.nativeElement.value);

  }
  changeColor():void{
    this.strColor=this.colorPicker?.nativeElement.value;
    // console.log(this.colorPicker?.nativeElement.value);
    // this.strColor = event?.target?
  }

  gerUserList(): void {
    // console.log('tis block')
    this.router.navigate(['whiteBoard', this.whiteBoardId, 'userListWB',], {queryParams: {userList: this.userList}} )
  }

  // updateBoardName(whiteboardName: string): void {
  //   this.whiteBoardService.updateBoard(this.whiteBoardId, { title: whiteboardName });
  // }
  updateBoardName(whiteBoardName: string): void {
    this.whiteBoardService.updateWhiteBoard(this.whiteBoardId, { title: whiteBoardName });
  }


}
