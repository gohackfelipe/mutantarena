import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IArena } from '../interfaces/arena';

@Injectable({
  providedIn: "root",
})
export class ArenaService {
  constructor(private httpClient: HttpClient) { }

  configArena(arena: IArena) {
    return this.httpClient.put(`${environment.backend}/arena/config`, arena);
  }

  getArena(idArena: string) {
    return this.httpClient.get(`${environment.backend}/arena/${idArena}`);
  }

  getAllArena(type: string) {
    return this.httpClient.get(`${environment.backend}/arena?q=${type}`);
  }

  delete(idArena: string) {
    return this.httpClient.delete(`${environment.backend}/arena/${idArena}`);
  }

  save(arena: IArena) {
    return this.httpClient.post(`${environment.backend}/arena`, arena);
  }

  update(arena: IArena) {
    return this.httpClient.put(`${environment.backend}/arena`, arena);
  }
}
