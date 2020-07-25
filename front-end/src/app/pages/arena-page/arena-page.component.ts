import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthenticationService } from "../../services/authentication.service";
import { RoundService } from "../../services/round.service";
import { MatSnackBar } from "@angular/material";
import { RankingService } from "src/app/services/ranking.service";
import { ArenaService } from "src/app/services/arena.service";
import { IRound } from 'src/app/interfaces/round';
import { ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import { Subscription } from 'rxjs';
import { IRanking } from "src/app/interfaces/ranking";

@Component({
  selector: "app-arena-page",
  templateUrl: "./arena-page.component.html",
  styleUrls: ["./arena-page.component.scss"],
})
export class ArenaPageComponent implements OnInit, OnDestroy {


  currentUser: any;
  loading = false;
  arenaParameterValue: string;
  selectArenaModal = true;
  infoArenaModal = false;
  lastTestCaseCode = `\//O código abaixo foi gerado automáticamente. \//Ref. para classes importantes para enriquecer o seu teste.\nvar assert = require('assert');\nvar expect = require('chai').expect;\n\//Ref. da classe mutacionada. Não apagar essa linha.\nvar app = require('./app');
  \n\n//Insira o seu código aqui`;
  arenaSourceCode;

  public tabs = [
    {
      label: "CÓDIGO",
      active: true,
    },
    {
      label: "MEUS TESTES",
      active: false,
    },
    {
      label: "",
      active: false,
    },
    {
      label: "",
      active: false
    }
  ];

  // arena: IArena;
  lastRound: IRound;
  rounds: IRound[];
  ranking: IRanking;
  userPositionRanking: number;

  private _roundsSub: Subscription;
  private _lastRoundSub: Subscription;

  private interval;

  constructor(
    private authenticationService: AuthenticationService,
    private roundService: RoundService,
    private rankingService: RankingService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private arenaService: ArenaService
  ) {
    this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.arenaParameterValue = params.get("arena");
      // this.prepareArena();
      if (this.arenaParameterValue) {
        console.log('Initializing service');

        this._lastRoundSub = this.roundService.
          listByUserAndArena()
          .subscribe((round: IRound) => {
            if (this.lastRound) {
              this.loading = this.lastRound.status === 'QUEUE';
            }

            if (!this.lastRound) {
              this.lastRound = round;
              if (round.testCaseCode) {
                this.lastTestCaseCode = round.testCaseCode;
              }
              this.loading = false;
            }

            if (round.status !== this.lastRound.status) {
              this.lastRound = round;
              if (round.testCaseCode) {
                this.lastTestCaseCode = round.testCaseCode;
              }
            }

            // if (!this.lastTestCaseCode) {
            //   this.lastTestCaseCode = this.lastRound.testCaseCode;
            // }
            this.selectArenaModal = false;
            // this.loading = false;
          }, err => {
            this.loading = false;
            console.log(err);
          });

        this._roundsSub = this.roundService.
          history()
          .subscribe((rounds: IRound[]) => {
            this.rounds = rounds;
            this.selectArenaModal = false;
          }, err => {
            console.log(err);
          });

        this.init();
        this.loading = false;
      } else {
        this.selectArenaModal = true;
      }
    });
  }

  loadRanking() {
    this.rankingService.getRanking(this.arenaParameterValue).subscribe((response: any) => {
      this.ranking = response.success.data;
      if (this.ranking.rounds) {
        this.userPositionRanking = _.chain(this.ranking.rounds).findIndex((o) => o.user === this.authenticationService.getUserEmail()) + 1;
      }
    });
  }

  ngOnDestroy() {
    if (this._lastRoundSub) {
      this._lastRoundSub.unsubscribe();
    }
    if (this._roundsSub) {
      this._roundsSub.unsubscribe();
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  init() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      this.roundService.getLastArena(this.authenticationService.getUserEmail(), this.arenaParameterValue);
    }, 1000);

    this.loadRanking();
    this.describeSourceCodeFromArena();
  }

  get scoreKilledVsSurvivedText() {
    if (!this.lastRound) {
      return "0% exterminado";
    }

    if (this.lastRound.status === "ERR" || this.lastRound.status === "INI") {
      return "0% exterminado";
    }
    const total = this.lastRound.mutants.length;
    return `${Math.round(this.totalMutantsOfRoundWithStatus(1, 'equals') * 100 / total)}% exterminado(s)`;
  }
  // NoCoverage = 0
  // Killed = 1
  // Survived = 2
  // TimedOut = 3
  // RuntimeError = 4
  // TranspileError = 5
  // firstMutant = 100
  totalMutantsOfRoundWithStatus(status: number, type: string) {
    let returnValue = 0;
    if (this.lastRound && this.lastRound.mutants) {
      if (this.lastRound.mutants.length > 0) {
        returnValue = this.lastRound.mutants.reduce((accumulator, value) => {
          if (type === 'equals') {
            if (value.status === status) {
              return accumulator + 1;
            }
          } else {
            if (value.status !== status) {
              return accumulator + 1;
            }
          }
          return accumulator;
        }, 0);
      }
    }
    return returnValue;
  }

  sendCode() {

    let newRound: IRound = {
      arena: this.arenaParameterValue,
      testCaseCode: this.lastTestCaseCode,
      user: this.authenticationService.getUserEmail()
    };

    this.roundService.enqueue(newRound);
    this.snackbar.open("Código enviado com sucesso!", "OK");
  }

  getNameArenaToRankingTab() {
    let value = '';
    if (this.ranking && this.ranking.arena.name) {
      value = this.ranking.arena.name;
    }
    return value.toUpperCase();
  }

  changeTab(index: number) {
    this.tabs.forEach(tab => {
      tab.active = false;
    });
    this.tabs[index].active = true;
  }

  describeSourceCodeFromArena() {
    this.arenaService.getArena(this.arenaParameterValue).subscribe((__response: any) => {
      this.arenaSourceCode = __response.success.data.sourceToMutate;
    });
  }
}
