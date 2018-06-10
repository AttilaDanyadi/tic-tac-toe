import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { DialogService } from "ng2-bootstrap-modal";

import { Board, Cell, CellState } from '../../models/board.model';
import { SaveModal, SaveDialogParams, ConfirmModal } from "../../components/index";
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
      cell.State = 'user';
      this.Supervise();
    }
  }
  private Save() {
    let caller: Observable<Response>;
    if (this.Board.Data.id) {
      //update
      caller = this.dataProvider.SaveBoard(this.Board.ExportData());
    } else {
      //create
      caller = this.AskForBoardName().concatMap(boardName => {
        if (boardName) {
          this.Board.Data.boardName = boardName;
          return this.dataProvider.CreateBoard(this.Board.ExportData());
        } else {
          return undefined;
        }
      });
    }
    if (!caller) return;
    caller.subscribe(
      response => { },
      (error: Response) => {
        console.log('save', error);
        this.dialogService.addDialog(ConfirmModal, {
          title: 'Save game error',
          message: 'Status: ' + error.status + ' - ' + error.statusText
        })
      }
    );
  }

  private AskForBoardName() {
    return this.dialogService
      .addDialog(SaveModal, { title: 'Save game' })
      .map(dialogResult => {
        console.log(dialogResult);
        return (dialogResult)
          ? dialogResult.boardName
          : undefined;
      });
  }
}