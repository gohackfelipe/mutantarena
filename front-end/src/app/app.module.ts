import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeftLogoComponent } from './components/left-logo/left-logo.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignUpPageComponent } from './pages/sign-up-page/sign-up-page.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ToasterComponent } from './components/toaster/toaster.component';
import { ModalComponent } from './components/modal/modal.component';
import { ArenaPageComponent } from './pages/arena-page/arena-page.component';
import { MutantCardComponent } from './components/mutant-card/mutant-card.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HistoryItemComponent } from './components/history-item/history-item.component';

import { AngularMonacoEditorConfig, AngularMonacoEditorModule } from 'angular-monaco-editor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';

import * as monaco from 'monaco-editor';
import { ConfigPageComponent } from './pages/config-page/config-page.component';
import { ShellComponent } from './components/shell/shell.component';
import { RankingItemComponent } from './components/ranking-item/ranking-item.component';
import { NoItemsFoundComponent } from './components/no-items-found/no-items-found.component';
import { ModalArenaComponent } from './components/modal-arena/modal-arena.component';
import { ArenaItemComponent } from './components/arena-item/arena-item.component';
import { ArenaConfigItemComponent } from './components/arena-config-item/arena-config-item.component';
import { MutantConfigItemComponent } from './components/mutant-config-item/mutant-config-item.component';
import { MutantTestInfosComponent } from './pages/mutant-test-infos/mutant-test-infos.component';

const config: AngularMonacoEditorConfig = {
  defaultOptions: {
    theme: 'vs-dark',
    language: 'javascript',
    minimap: {
      enabled: false
    }
  }
};

@NgModule({
  declarations: [
    AppComponent,
    LeftLogoComponent,
    LoginPageComponent,
    SignUpPageComponent,
    LoadingComponent,
    ToasterComponent,
    ModalComponent,
    ArenaPageComponent,
    MutantCardComponent,
    HistoryItemComponent,
    ConfigPageComponent,
    ShellComponent,
    RankingItemComponent,
    NoItemsFoundComponent,
    ModalArenaComponent,
    ArenaItemComponent,
    ArenaConfigItemComponent,
    MutantConfigItemComponent,
    MutantTestInfosComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    AngularMonacoEditorModule.forRoot(config),
    BrowserAnimationsModule
  ],
  providers: [{ provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } }],
  bootstrap: [AppComponent]
})
export class AppModule { }
