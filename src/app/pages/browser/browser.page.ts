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

  constructor(private dataProvider: DataProvider) { }

  ngOnInit() {
    this.dataProvider.GetBoard().subscribe(
      (boards: Board[]) => {
        this.Boards = boards;
      },
      (error) => console.log('error', error)
    );
  }
}