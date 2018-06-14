import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { DialogService } from "ng2-bootstrap-modal";

import { Board, Cell, CellState } from '../../models/board.model';
import { MessageBox, SaveModal, SaveDialogParams, ConfirmModal } from "../../components/index";
import { DataProvider, ComputerProvider } from '../../providers/index';

@Component({
  selector: '[game]',
  templateUrl: './game.page.html',
  encapsulation: ViewEncapsulation.None
})
export class GamePage implements OnInit {
  public Board: Board;
  public get Message(): string {
    switch (this.Board.GameResult) {
      case 'nobody':
        switch (this.Board.NextPlayer) {
          case 'user':
            return 'User puts...';
          case 'computer':
            return 'Computer puts...';
          default:
            return '?';
        }
      case 'draw':
        return 'Draw !';
      case 'user':
        return 'User won :)';
      case 'computer':
        return 'Computer won :('
      default:
        return '?';
    }
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
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
          }
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
          if (cell) {
            cell.State = 'computer';
            this.Board.Changed = true;
          }
          this.Supervise();
        });
        break;
      case 'nobody':
        break;
      default:
        throw { message: 'Invalid player!' }
    }
  }

  private CellClick(cell: Cell) {
    let player = this.Board.NextPlayer;
    if (player == 'user') {
      cell.State = 'user';
      this.Board.Changed = true;
      this.Supervise();
    }
  }
  private StartNewGame() {
    if (this.Board.Changed) {
      new MessageBox(this.dialogService).Show({
        title: 'Save game?',
        message: 'Your game is not saved. Do you want to save?',
        buttons: ['Yes', 'No', 'Cancel'],
        icon: undefined,
        defaultButton: 'Yes'
      }).subscribe(dialogResult => {
        switch (dialogResult) {
          case 'Yes':
            this.Save().subscribe(
              result => this.CreateNewGame()
            );
            break;
          case 'No':
            this.CreateNewGame();
            break;
          default:
            break;
        }
      });
    } else {
      this.CreateNewGame();
    }
  }
  private CreateNewGame() {
    this.Board = new Board();
    this.Supervise();
  }
  private Save() {
    let caller: Observable<Response>;
    if (this.Board.Data.id) {
      //update
      caller = this.dataProvider.SaveBoard(this.Board.ExportData());
    } else {
      //create
      caller = this.AskForBoardName().concatMap(boardName => {
        if (boardName && boardName != '') {
          this.Board.Data.boardName = boardName;
          return this.dataProvider.CreateBoard(this.Board.ExportData());
        } else {
          return Observable.from([undefined]);
        }
      });
    }
    caller.subscribe(
      response => { if (response) this.Board.Changed = false },
      (error: Response) => {
        // console.log('save', error);
        // this.dialogService.addDialog(ConfirmModal, {
        //   title: 'Save game error',
        //   message: 'Status: ' + error.status + ' - ' + error.statusText
        // })
        throw error;
      }
    );
    return caller;
  }

  private AskForBoardName() {
    return this.dialogService
      .addDialog(SaveModal, { title: 'Save game' })
      .map(dialogResult => {
        return (dialogResult)
          ? dialogResult.boardName
          : undefined;
      });
  }
}