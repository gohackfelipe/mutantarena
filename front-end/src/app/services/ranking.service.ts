import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class RankingService {
  constructor(private httpClient: HttpClient) { }

  getRanking(idArena: string) {
    return this.httpClient.get(`${environment.backend}/ranking/${idArena}`);
  }
}
