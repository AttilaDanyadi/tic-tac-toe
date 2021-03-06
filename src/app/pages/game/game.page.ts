import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/delay';
import { DialogService } from "ng2-bootstrap-modal";

import { Board, Cell, CellState } from '../../models/board.model';
import { Computer } from '../../models/computer';
import { MessageBox, SaveModal, SaveDialogParams } from "../../components/index";
import { DataProvider } from '../../providers/index';

@Component({
  selector: '[game]',
  templateUrl: './game.page.html',
  encapsulation: ViewEncapsulation.None
})
export class GamePage implements OnInit {
  public Board: Board;
  public Computer: Computer;
  public get Message(): string {
    switch (this.Board.GameResult) {
      case 'nobody':
        switch (this.Board.NextPlayer) {
          case 'x':
            return 'User puts...';
          case 'o':
            return 'Computer puts...';
          default:
            return '?';
        }
      case 'draw':
        return 'Draw !';
      case 'x':
        return 'User won :)';
      case 'o':
        return 'Computer won :('
      default:
        return '?';
    }
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private dataProvider: DataProvider
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      let id = params['id'] as string;
      if (id) {
        this.dataProvider.GetBoard(id).subscribe(
          (board: Board) => {
            this.Board = board;
            this.Computer = new Computer(this.Board, 'o');
          }
        );
      } else {
        this.CreateNewGame();
      }
    });
  }

  private Supervise() {
    console.log('Supervise');

    switch (this.Board.NextPlayer) {
      case 'x':
        break;
      case 'o':
        Observable.from([this.Computer.Put()]).delay(500).subscribe(choice => {
          if (choice) {
            choice.State = 'o';
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
    if (player == 'x') {
      cell.State = 'x';
      this.Board.Changed = true;
      this.Supervise();
    }
  }
  private HelpMe() {
    let computer = new Computer(this.Board, 'x');
    Observable.from([computer.Put()]).delay(500).subscribe(choice => {
      if (choice) {
        choice.State = 'x';
        this.Board.Changed = true;
      }
      this.Supervise();
    });
  }

  private Browse() {
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
              result => this.NavigateToBrowser()
            );
            break;
          case 'No':
            this.NavigateToBrowser();
            break;
          default:
            break;
        }
      });
    }
    else {
      this.NavigateToBrowser();
    }
  }
  private NavigateToBrowser() {
    this.router.navigate(['browser']);
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
    this.Computer = new Computer(this.Board, 'o');
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
      response => { if (response) this.Board.Changed = false }
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