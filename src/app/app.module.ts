import { NgModule, enableProdMode, ErrorHandler } from '@angular/core';
import { CommonModule } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { DialogService, BootstrapModalModule } from "ng2-bootstrap-modal";

import { AppComponent } from './app.component';
import { GamePage, BrowserPage } from './pages/index';
import { GlobalErrorHandler, DataProvider } from './providers/index';
import { BoardComponent, CellComponent, MessageBox, SaveModal } from "./components/index";

enableProdMode();

const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'game' },
  { path: 'game', component: GamePage },
  { path: 'browser', component: BrowserPage }
];

@NgModule({
  imports: [
    BootstrapModalModule,
    BootstrapModalModule.forRoot({ container: document.body }),
    CommonModule,
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(ROUTES),
    HttpModule
  ],
  declarations: [
    AppComponent,
    BrowserPage,
    GamePage,
    BoardComponent,
    CellComponent,
    MessageBox,
    SaveModal
  ],
  entryComponents: [
    MessageBox,
    SaveModal
  ],
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler},
    { provide: APP_BASE_HREF, useValue: '/' },
    DataProvider
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }