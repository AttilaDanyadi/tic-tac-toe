import { NgModule ,enableProdMode} from '@angular/core';
import { CommonModule } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';

import { BootstrapModalModule } from 'ng2-bootstrap-modal';

import { AppComponent } from './app.component';
import { WelcomePage, BrowserPage, GamePage, TestPage } from './pages/index';
import { DataProvider, ComputerProvider } from './providers/index';
import { BoardComponent, CellComponent, ConfirmModal,SaveModal } from "./components/index";

enableProdMode();

const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'welcome' },
  { path: 'welcome', component: WelcomePage },
  { path: 'browser', component: BrowserPage },
  { path: 'game', component: GamePage },
  { path: 'test', component: TestPage }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(ROUTES),
    HttpModule,
    BootstrapModalModule,
    BootstrapModalModule.forRoot({ container: document.body })
  ],
  declarations: [
    AppComponent,
    WelcomePage,
    BrowserPage,
    GamePage,
    TestPage,
    BoardComponent,
    CellComponent,
    ConfirmModal,
    SaveModal
  ],
  entryComponents: [
    ConfirmModal,
    SaveModal
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    DataProvider,
    ComputerProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
