import { Component, OnInit, Input } from '@angular/core';
import { IScoreRounds } from 'src/app/interfaces/ranking';

@Component({
  selector: 'app-ranking-item',
  templateUrl: './ranking-item.component.html',
  styleUrls: ['./ranking-item.component.scss']
})
export class RankingItemComponent implements OnInit {

  @Input() round: IScoreRounds;
  @Input() index: number;

  constructor() { }

  ngOnInit() {
  }
}
