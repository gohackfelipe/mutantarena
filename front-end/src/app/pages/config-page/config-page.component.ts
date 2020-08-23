import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../../services/authentication.service";
import { MatSnackBar } from "@angular/material";
import { ArenaService } from "../../services/arena.service";
import { Router } from "@angular/router";
import { IArena } from 'src/app/interfaces/arena';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: "app-config-page",
  templateUrl: "./config-page.component.html",
  styleUrls: ["./config-page.component.scss"],
})
export class ConfigPageComponent implements OnInit {

  codeDefault = `class MutantArena {\n\n}`;
  arenas: IArena[];
  arenaForm: FormGroup;
  currentUser: any;
  code = this.codeDefault;
  loading: boolean;
  arenaTotal = 0;
  submitted = false;
  boxArena = false;

  public tabs = [
    {
      label: "CÓDIGO",
      active: true,
    },
    {
      label: "CONFIGURAÇÕES",
      active: false,
    },
  ];

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private arenaService: ArenaService,
    private snackbar: MatSnackBar
  ) {
    this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.listArena();
    });
  }

  ngOnInit() {

    this.createForm();
  }

  createForm() {
    this.arenaForm = this.formBuilder.group({
      _id: [''],
      nameArena: ['', Validators.required],
      descriptionArena: ['', Validators.required]
    });
  }

  public listArena() {
    this.arenaService.getAllArena('all').subscribe((res: any) => {
      if (res.success) {
        this.arenas = res.success.data;
        this.arenaTotal = res.success.total;
      }
    });
  }

  // sendCode() {
  //   this.arena.sourceToMutate = this.code;
  //   // TODO: verificar retorno padrão e remover any
  //   this.arenaService.configArena(this.arena).subscribe((res: any) => {
  //     if (res.success) {
  //       this.snackbar.open("Código enviado com sucesso!", "OK");
  //     }
  //   });
  // }

  get f() { return this.arenaForm.controls; }

  save() {
    this.submitted = true;
    if (this.arenaForm.invalid) {
      return;
    }
    this.loading = true;
    //new arena
    if (!this.f._id.value) {
      const arena: IArena = {
        name: this.f.nameArena.value,
        sourceToMutate: this.code,
        description: this.f.descriptionArena.value
      };
      this.arenaService.save(arena).subscribe((res: any) => {
        if (res.success) {
          this.refresh("Arena criada com sucesso!", "OK");
        }
      }, error => {
        this.loading = false;
        this.snackbar.open("Um erro ocorreu ao tentar salvar a arena", "OK");
      });
    } else {
      // editing arena
      const arena: IArena = {
        _id: this.f._id.value,
        name: this.f.nameArena.value,
        description: this.f.descriptionArena.value,
        sourceToMutate: this.code
      };
      this.arenaService.update(arena).subscribe((res: any) => {
        this.refresh("Arena atualizada com sucesso!", "OK");
      }, error => {
        this.loading = false;
        this.snackbar.open("Um erro ocorreu ao tentar atualizar a arena", "OK");
      });
    }
  }

  delete($event) {
    const arena: IArena = $event.data;
    if (arena && arena._id) {
      this.arenaService.delete(arena._id).subscribe((res: any) => {
        const deleted = res.success.data.ok;
        console.log(deleted);
        if (deleted) {
          this.refresh("Arena excluida com sucesso!", "OK");
        }
      }, error => {
        this.loading = false;
        this.snackbar.open("Um erro ocorreu ao excluir a arena.", "OK");
      });
    }
  }

  // getCode() {
  //   console.log("getCode");
  //   this.arenaService.getArena(this.arena._id).subscribe((res: any) => {
  //     if (res.success && res.success.data) {
  //       const data = res.success.data;
  //       this.code = data.sourceToMutate;
  //     }
  //   });
  // }

  refresh(msg, action) {
    this.resetFormAndBox();
    this.snackbar.open(msg, action);
    this.listArena();
    this.loading = false;
    this.code = this.codeDefault;
  }

  resetFormAndBox() {
    this.code = this.codeDefault;
    this.boxArena = false;
    this.arenaForm.reset();
  }

  edit($event) {
    const arena: IArena = $event.data;
    if (arena) {
      this.boxArena = true;
      this.arenaForm.setValue({
        _id: arena._id,
        nameArena: arena.name,
        descriptionArena: arena.description
      });
      this.code = arena.sourceToMutate;
    }
  }

  activeNewArenaBox() {
    this.arenaForm.reset();
    this.boxArena = true;
  }

  changeTab(index: number) {
    this.tabs.forEach(tab => {
      tab.active = false;
    });

    this.tabs[index].active = true;
  }
}
