import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss']
})
export class ToasterComponent implements OnInit {


  private _message: string;

  constructor() {
  }

  ngOnInit() {
  }

  get message() {
    return this._message;
  }

  @Input()
  set message(newMessage: string) {
    this._message = newMessage;
  }

}
