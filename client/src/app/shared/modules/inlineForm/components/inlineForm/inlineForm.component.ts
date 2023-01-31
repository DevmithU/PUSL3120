import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'inline-form',
  templateUrl: './inlineForm.component.html',
})
export class InlineFormComponent implements AfterViewInit{
  @Input() title: string = '';
  @Input() defaultText: string = 'Not defined';
  @Input() hasButton: boolean = false;
  @Input() buttonText: string = 'Submit';
  @Input() inputPlaceholder: string = '';
  @Input() inputType: string = 'input';

  @Output() handleSubmit = new EventEmitter<string>();

  @ViewChild('input1') input1: ElementRef | undefined ;
  @ViewChild('input2') input2: ElementRef | undefined ;

  // @ViewChild('input2') input2: any;
  isButtonHOver: boolean =false;
  isEditing: boolean = false;
  form = this.fb.group({
    title: [''],
  });

  constructor(
    private fb: FormBuilder
  ) {}

  activeEditing(): void {
    if(!this.isEditing){
      if (this.title) {
        this.form.patchValue({ title: this.title });
      }

      this.isEditing = true;
      //need time to delay execution for after render of element
      setTimeout(() => {
        if (this.input2?.nativeElement) {
          this.input2.nativeElement.focus();
        }
        if (this.input1?.nativeElement) {
          this.input1.nativeElement.focus();
        }
      }, 0);


    }

  }
  buttonHoverEnter():void{
    this.isButtonHOver =true;

  }
  buttonHoverLeave():void{
    this.isButtonHOver =false;


  }
  leaveEditing(): void {

    this.isEditing = false;
  }
  leaveEditingWithCheck(): void {
    if(!this.isButtonHOver){
      this.isEditing = false;
      console.log('leave editing completed')
    }
  }
  stillTextArea():void{
    this.isEditing = true;

  }

  onSubmit(): void {
    if (this.form.value.title) {
      this.handleSubmit.emit(this.form.value.title);
    }
    this.isEditing = false;
    this.form.reset();
  }

  ngAfterViewInit(): void {
  }



}
