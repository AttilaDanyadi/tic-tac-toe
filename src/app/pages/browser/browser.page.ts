import { Component, ViewEncapsulation, OnInit } from '@angular/core';
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

  constructor(private dataProvider: DataProvider) { }

  ngOnInit() {
    this.dataProvider.GetBoard().subscribe(
      (boards: Board[]) => this.Boards = boards,
      (error) => console.log('error', error)
    );
  }

  private Filter() {
    // if (!this.SearckKey){
    //   console.log('SearckKey empty');
    //   return;
    // }
    this.dataProvider.GetBoardsByNameFragment(this.SearckKey).subscribe(
      (boards: Board[]) => this.Boards = boards,
      (error) => console.log('error', error)
    );
  }
}