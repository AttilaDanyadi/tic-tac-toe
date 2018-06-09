import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Board } from '../../models/board.model';
import { DataProvider } from '../../providers/data.provider';

@Component({
  selector: '[browser]',
  templateUrl: './browser.page.html',
  encapsulation: ViewEncapsulation.None,
})
export class BrowserPage implements OnInit {
  public Boards: Board[];
  private _searckKey = '';
  public get SearckKey() { return this._searckKey; }
  public set SearckKey(value) {
    this._searckKey = value;
    this.Filter();
  }

  constructor(private dataProvider: DataProvider, private router: Router) { }

  ngOnInit() {
    this.dataProvider.GetBoard().subscribe(
      (boards: Board[]) => this.Boards = boards,
      (error) => console.log('error', error)
    );
  }

  private Filter() {
    this.dataProvider.GetBoardsByNameFragment(this.SearckKey).subscribe(
      (boards: Board[]) => this.Boards = boards,
      (error) => console.log('error', error)
    );
  }

  private Open(id: string) {
    this.router.navigate(['game'], { queryParams: { id: id } });
  }
  private Delete(id: string) {
    this.dataProvider.DeleteBoard(id).subscribe(
      (result) => console.log('result', result),
      (error) => console.log('error', error)
    );
  }
}