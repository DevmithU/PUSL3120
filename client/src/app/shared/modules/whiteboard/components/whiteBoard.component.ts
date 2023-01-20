import { Component, ViewChild, ElementRef, AfterViewInit,OnInit } from '@angular/core';


@Component({
  selector: 'whiteBoard',
  templateUrl: './whiteBoard.component.html',
})
export class whiteBoardComponent implements OnInit,AfterViewInit  {
  @ViewChild('myCanvas') canvas: ElementRef | null;
  @ViewChild('wb') wb: ElementRef | null | undefined;

  private ctx: CanvasRenderingContext2D  | null;
  private isDrawing = false;
  private lastX = 0 ;
  private lastY = 0;
  private offset: { x: any; y: any; } | undefined;
  constructor()
    {
      this.ctx = null;
      this.canvas = null;
      console.log('width1',this.wb?.nativeElement)
    }
  ngOnInit(): void {
    console.log('width2',this.wb?.nativeElement.width)
  }
  ngOnDestroy(): void {

  }
  ngAfterViewInit() {
    if(this.canvas && this.wb){
      console.log('width3',this.wb.nativeElement.width)
      let wbRect = this.wb.nativeElement.getBoundingClientRect();
      this.canvas.nativeElement.width = wbRect.width;
      this.canvas.nativeElement.height = wbRect.height;
      this.ctx = this.canvas?.nativeElement.getContext('2d');
      this.offset = {x: wbRect.left, y: wbRect.top};
    }

  }

  startDrawing(event: MouseEvent) {
    this.isDrawing = true;
    let coordinates = {x: event.clientX - this.offset?.x, y: event.clientY - this.offset?.y};
    this.lastX = coordinates.x;
    this.lastY = coordinates.y;
  }

  drawLine(event: MouseEvent) {
    let coordinates;
    if (!this.isDrawing) {
      return;
    }
    if (this.ctx){
      coordinates = {x: event.clientX - this.offset?.x, y: event.clientY - this.offset?.y};
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(coordinates.x, coordinates.y);
      this.ctx.stroke();
    }
    if (coordinates){
      this.lastX = coordinates?.x;
      this.lastY = coordinates?.y;
    }
  }
  stopDrawing() {
    this.isDrawing = false;
  }

}
