import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Board } from '../models/board.model';
import 'rxjs/add/operator/delay';

@Injectable()
export class ComputerProvider {
    public Decide(board: Board, dontThink?: boolean) {
        let cell = (dontThink == true)
            ? this.GetFirstEmptyCell(board)
            : this.GetCellByStrategy(board);
            console.log('decide',cell);
            
        return Observable.from([cell]).delay(3000);
    }
    private GetFirstEmptyCell(board: Board) {
        return board.Cells.FirstOrDefault(cell => cell.State == 'empty');
    }
    private GetCellByStrategy(board: Board) {
        return this.GetFirstEmptyCell(board);
    }
}