import { Component, OnInit, Input } from '@angular/core';
import { IArena } from 'src/app/interfaces/arena';

@Component({
  selector: 'app-arena-item',
  templateUrl: './arena-item.component.html',
  styleUrls: ['./arena-item.component.scss']
})
export class ArenaItemComponent implements OnInit {

  @Input() arena: IArena;

  constructor() { }

  ngOnInit() {
  }
}
