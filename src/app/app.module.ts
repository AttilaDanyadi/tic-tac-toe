import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { WelcomePage, BrowserPage, GamePage, TestPage } from './pages/index';
import { DataProvider } from './providers/data.provider';
import { BoardComponent, CellComponent } from "./components/index";

const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'welcome' },
  { path: 'welcome', component: WelcomePage },
  { path: 'browser', component: BrowserPage },
  { path: 'game', component: GamePage },
  { path: 'test', component: TestPage }
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    HttpModule
  ],
  declarations: [
    AppComponent,
    WelcomePage,
    BrowserPage,
    GamePage,
    TestPage,
    BoardComponent,
    CellComponent
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    DataProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
