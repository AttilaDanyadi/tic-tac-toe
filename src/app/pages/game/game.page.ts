import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Board, Cell, CellState } from '../../models/board.model';
import { DataProvider, ComputerProvider } from '../../providers/index';

@Component({
  selector: '[game]',
  templateUrl: './game.page.html',
  encapsulation: ViewEncapsulation.None
})
export class GamePage implements OnInit {
  public Board: Board;
  private waitUser: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataProvider: DataProvider,
    private computerProvider: ComputerProvider
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      let id = params['id'] as string;
      if (id) {
        this.dataProvider.GetBoard(id).subscribe(
          (board: Board) => {
            this.Board = board;
          },
          (error) => console.log('error', error)
        );
      } else {
        this.Board = new Board();
      }
    });
  }

  private Supervise() {
    switch (this.Board.NextPlayer) {
      case 'user':
        break;
      case 'computer':
        this.computerProvider.Decide(this.Board, true).subscribe(cell => {
          if (cell) cell.State = 'computer';
          this.Supervise();
        });
        break;
      case 'nobody':
        this.waitUser = false;
        break;
      default:
        this.waitUser = false;
        throw { message: 'Invalid player!' }
    }
  }

  private CellClick(cell: Cell) {
    let player = this.Board.NextPlayer;
    if (player == 'user') {
      cell.State = player as CellState;
      this.Supervise();
    }
  }
  private Save() {

  }
}