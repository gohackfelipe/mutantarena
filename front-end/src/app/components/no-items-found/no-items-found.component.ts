import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-no-items-found',
  templateUrl: './no-items-found.component.html',
  styleUrls: ['./no-items-found.component.scss']
})
export class NoItemsFoundComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;

  constructor() { }

  ngOnInit() {
  }

}
