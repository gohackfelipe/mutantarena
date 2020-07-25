import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IRound } from '../interfaces/round';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: "root",
})
export class RoundService {

  private socket;

  constructor(private httpClient: HttpClient) {

    this.socket = io(environment.backend);
  }

  enqueue(round: IRound) {
    return this.socket.emit('saveRound', round);
  }

  getLastArena(user: string, arena: string) {
    this.socket.emit('prepareArena', { user: user, arena: arena });
  }

  listByUserAndArena() {
    return Observable.create((observer) => {
      this.socket.on('lastRound', function (message) {
        observer.next(message);
      });
    });
  }

  history() {
    return Observable.create((observer) => {
      this.socket.on('history', function (message) {
        observer.next(message);
      });
    });
  }
}
