import { Component, ViewChild, ElementRef, AfterViewInit,OnInit } from '@angular/core';
import {SocketEventsEnum} from "../../../types/socketEvents.enum";
import {SocketService} from "../../../services/socket.service";
import {AuthenticationService} from "../../../../authentication/services/authentication.service";
import {Subject, takeUntil} from "rxjs";
import {ActivatedRoute, NavigationStart, Router} from "@angular/router";


@Component({
  selector: 'whiteBoard',
  templateUrl: './whiteBoard.component.html',
})
export class whiteBoardComponent implements OnInit,AfterViewInit  {
  unsubscribe$ = new Subject<void>();

  @ViewChild('myCanvas') canvas: ElementRef | null;
  @ViewChild('wb') wb: ElementRef | null | undefined;
  private ctx: CanvasRenderingContext2D  | null;
  private isDrawing = false;
  private lastX = 0 ;
  private lastY = 0;
  private offset: { x: any; y: any; } | undefined;
  userId: string | null | undefined ;
  whiteBoardId : string;
  constructor(
    private socketService: SocketService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,



  )
    {
      const whiteBoardId = this.route.snapshot.paramMap.get('whiteBoardId');
      if (!whiteBoardId) {
        throw new Error('Cant get whiteBoardId from url');
      }
      this.whiteBoardId =whiteBoardId;
      console.log('WB id',this.whiteBoardId)
      this.ctx = null;
      this.canvas = null;
      console.log('width1',this.wb?.nativeElement)
    }
  ngOnInit(): void {
    console.log('WB id',this.whiteBoardId)

    this.socketService.emit(SocketEventsEnum.whiteBoardJoin, {
      whiteBoardId: this.whiteBoardId,
    });
    window.onbeforeunload = function() {window.scrollTo(0,0);}
    this.userId = this.authService.currentUser$.value?.id;


    this.initializeListeners();

  }
  ngOnDestroy(): void {
    window.onbeforeunload = function() {window.scrollTo(0,0);}
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
        this.socketService.emit(SocketEventsEnum.whiteBoardLeave, {
          whiteBoardId: this.whiteBoardId,
        });

  }
  ngAfterViewInit():void {

    if(this.canvas && this.wb){
      console.log('width3',this.wb.nativeElement.width)

      let wbRect = this.wb.nativeElement.getBoundingClientRect();
      this.canvas.nativeElement.width = wbRect.width;
      this.canvas.nativeElement.height = wbRect.height;
      this.ctx = this.canvas?.nativeElement.getContext('2d');
      this.offset = {x: wbRect.left, y: wbRect.top};
      // this.offset = {x: wbRect.left, y: 560.667+40};

      console.log('wbrect',wbRect);
      console.log('offset this',this.offset);


    }

  }

  startDrawing(event: MouseEvent):void {
    this.isDrawing = true;
    let coordinates = {x: event.pageX - this.offset?.x, y: event.pageY - this.offset?.y};
    // if (window.scrollY>0){
    //   coordinates = {x: event.pageX - this.offset?.x, y: event.pageY- this.offset?.y - window.scrollY};
    // }

    this.lastX = coordinates.x;
    this.lastY = coordinates.y;
  }

  drawLine(event: MouseEvent):void {
    console.log('scroll window',window.scrollX, window.scrollY)
    let coordinates;
    if (!this.isDrawing) {
      return;
    }
    if (this.ctx){
      console.log("block activated333");

      coordinates = {x: event.pageX  - this.offset?.x, y: event.pageY - this.offset?.y};
      // if (window.scrollY>0){
      //   coordinates = {x: event.pageX - this.offset?.x, y: event.pageY- this.offset?.y - window.scrollY};
      // }
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      console.log('event check 435///////////////////////////////////////////////////')
      this.socketService.emit(SocketEventsEnum.drawdone,{whiteBoardId: this.whiteBoardId,x:coordinates.x, y:coordinates.y});
      this.ctx.lineTo(coordinates.x, coordinates.y);
      this.ctx.stroke();
    }
    if (coordinates){
      this.lastX = coordinates?.x;
      this.lastY = coordinates?.y;
    }
  }
  stopDrawing():void {
    this.isDrawing = false;
  }



  private initializeListeners(): void {
    this.socketService.listen(SocketEventsEnum.ondraw).pipe(takeUntil(this.unsubscribe$))
      .subscribe((message :any) => {
        var newX = message.x;
        var newY = message.y;
        let coordinates;
        if(!this.isDrawing){
          console.log("block activated");

          // coordinates = {x: newX - this.offset?.x, y: newY - this.offset?.y};
          //
          // this.lastX = coordinates.x;
          // this.lastY = coordinates.y;
          /////////////end of start
          if (this.ctx){
            console.log("block activated2");

            coordinates = {x: newX - this.offset?.x, y: newY - this.offset?.y};
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(coordinates.x, coordinates.y);
            this.ctx.stroke();
          }
          if (coordinates){
            this.lastX = coordinates?.x;
            this.lastY = coordinates?.y;
          }
          //////////////////end of draw

        }

        console.log("whiteBoardId: ", message.whiteBoardId);
        console.log("x: ", message.x);
        console.log("y: ", message.y);
        console.log(this.isDrawing);
      });




    // this.router.events.subscribe((event) => {
    //   //                                       add this condition to not trigger leavebaord when viewing tasks, condition only checks for /dashBoard/, think of better condition
    //   if (event instanceof NavigationStart && !event.url.includes('/whiteBoard/')) {
    //     this.socketService.emit(SocketEventsEnum.whiteBoardLeave, {
    //       whiteBoardId: this.whiteBoardId,
    //     });
    //   }
    // });


  }
}
