import { Component, OnInit, Input } from '@angular/core';
import { IMutant } from 'src/app/interfaces/mutant';
import { MutantsName } from 'src/app/interfaces/mutants-enum';

@Component({
  selector: 'app-mutant-card',
  templateUrl: './mutant-card.component.html',
  styleUrls: ['./mutant-card.component.scss']
})
export class MutantCardComponent implements OnInit {

  @Input() mutant: IMutant;

  constructor() { }

  ngOnInit() {
  }

  get name() {
    if (this.mutant && this.mutant.id) {
      return MutantsName[this.mutant.id];
    }
  }
}
