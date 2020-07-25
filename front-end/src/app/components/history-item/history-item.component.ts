import { Component, OnInit, Input } from '@angular/core';
import { IRound } from 'src/app/interfaces/round';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-history-item',
  templateUrl: './history-item.component.html',
  styleUrls: ['./history-item.component.scss']
})
export class HistoryItemComponent implements OnInit {


  @Input() round: IRound;

  constructor() { }

  ngOnInit() {
    // console.log(this.round);
  }

  // status table
  // NoCoverage = 0
  // Killed = 1
  // Survived = 2
  // TimedOut = 3
  // RuntimeError = 4
  // TranspileError = 5
  // firstMutant = 100
  totalMutantsKilled() {
    let returnValue = 0;
    if (this.round.status !== "ERR") {
      returnValue = this.round.mutants.reduce((accumulator, value) => {
        if (value.status === 1) {
          return accumulator + 1;
        }
        return accumulator;
      }, 0);
    }
    return returnValue;
  }

  totalMutants() {
    let returnValue = 0;
    if (this.round.status !== "ERR") {
      returnValue = this.round.mutants.length;
    }
    return returnValue;
  }

  get score() {
    return this.totalMutantsKilled() > 0
      ? `${this.totalMutantsKilled()} / ${this.totalMutants()} Exterminados`
      : `${this.totalMutantsKilled()} / ${this.totalMutants()} Exterminado`;
  }

  get dateCreated() {
    return moment(this.round.dateCreated).format("DD/MM/YYYY");;
  }

  get timeCreated() {
    return moment(this.round.dateCreated).format("hh:mm:ss");
  }

  visualizeReportDetail() {
    const url = `${environment.report}?round=${this.round._id}`;
    window.open(url, '_blank');
  }
}
