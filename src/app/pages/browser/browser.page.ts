import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { DialogService } from "ng2-bootstrap-modal";

import { Board } from '../../models/board.model';
import { DataProvider } from '../../providers/data.provider';
import { ConfirmModal } from "../../components/index";

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
    this.LoadBoards();
  }

  constructor(
    private router: Router,
    private dialogService: DialogService,
    private dataProvider: DataProvider
  ) { }

  ngOnInit() {
    this.LoadBoards();
  }

  private LoadBoards() {
    let loader = (this.SearckKey)
      ? this.dataProvider.GetBoardsByNameFragment(this.SearckKey)
      : this.dataProvider.GetBoard() as Observable<Board[]>
    loader.subscribe(
      (boards: Board[]) => this.Boards = boards
    );
  }

  private Open(id: string) {
    this.router.navigate(['game'], { queryParams: { id: id + 'd' } });
  }
  private Delete(board: Board) {
    this.dialogService.addDialog(ConfirmModal, {
      title: 'Delete game',
      message: 'Do you really want to delete the game: ' + board.Data.boardName + ' ?'
    }).subscribe(ok => {
      if (ok) {
        this.dataProvider
          .DeleteBoard(board.Data.id)
          .do(res => {
            this.LoadBoards();
            return res;
          })
          .subscribe(
            (result) => console.log('result', result),
            (error) => console.log('error', error)
          );
      }
    });
  }
}