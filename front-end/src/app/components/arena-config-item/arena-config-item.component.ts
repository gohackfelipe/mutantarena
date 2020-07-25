import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IArena } from 'src/app/interfaces/arena';
import { ArenaService } from "../../services/arena.service";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: 'app-arena-config-item',
  templateUrl: './arena-config-item.component.html',
  styleUrls: ['./arena-config-item.component.scss']
})
export class ArenaConfigItemComponent implements OnInit {

  @Input() arena: IArena;
  @Output() deleteEvent = new EventEmitter();
  @Output() editEvent = new EventEmitter();

  constructor(private arenaService: ArenaService, private router: Router, private snackbar: MatSnackBar) { }

  ngOnInit() {
  }

  delete(arena) {
    if (arena) {
      this.deleteEvent.emit({ type: "delete", data: arena });
    }
  }

  edit(arena) {
    if (arena) {
      this.editEvent.emit({ type: "edit", data: arena });
    }
  }
}
