import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../../services/authentication.service";
import { ArenaService } from "../../services/arena.service";
import { IArena } from 'src/app/interfaces/arena';

@Component({
  selector: 'app-modal-arena',
  templateUrl: './modal-arena.component.html',
  styleUrls: ['./modal-arena.component.scss']
})
export class ModalArenaComponent implements OnInit {

  arenas: IArena[];
  arenaTotal = 0;
  currentUser: any;

  constructor(private authenticationService: AuthenticationService, private arenaService: ArenaService) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.listArena();
    });
  }

  public listArena() {
    this.arenaService.getAllArena('filter').subscribe((res: any) => {
      if (res.success) {
        this.arenas = res.success.data;
        this.arenaTotal = res.success.total;
      }
    });
  }

  selectArena(arena: IArena) {

  }
}
