import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Board, Cell, CellState } from '../../models/board.model';
import { DataProvider } from '../../providers/data.provider';

@Component({
  selector: '[game]',
  templateUrl: './game.page.html',
  encapsulation: ViewEncapsulation.None
})
export class GamePage implements OnInit {
  public Board: Board;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private dataProvider: DataProvider
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      let id = params['id'] as string;
      if (id) {
        this.dataProvider.GetBoard(id).subscribe(
          (board: Board) => this.Board = board,
          (error) => console.log('error', error)
        );
      } else {
        this.Board = new Board();
      }
    });
  }

  private CellClick(cell: Cell) {
    if (this.Board.NextPlayer != 'nobody') {
      cell.State = this.Board.NextPlayer as CellState;
    }
  }
  private Save() {

  }
}