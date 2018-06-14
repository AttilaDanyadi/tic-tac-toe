import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Board, Player } from '../models/board.model';
import 'rxjs/add/operator/delay';

@Injectable()
export class ComputerProvider {
    public Decide(board: Board, dontThink?: boolean) {
        let cell = (dontThink == true)
            ? this.GetFirstEmptyCell(board)
            : this.GetCellByStrategy(board);
        return Observable.from([cell]).delay(100);
    }
    private GetFirstEmptyCell(board: Board) {
        return board.Cells.FirstOrDefault(cell => cell.State == 'empty');
    }
    private GetCellByStrategy(board: Board) {
        let choice = this.Check1(board);
        if (choice) return choice;
        return this.GetFirstEmptyCell(board);
    }
    private Check1(board: Board) {
        if (board.Empty) {
            //sarokra
            return board.GetCell(2, 2);
        } else {
            let userCell = board.Cells.SingleOrDefault(cell => cell.State == 'user');
            console.log(userCell);

            if (userCell) {
                // csak 1-et rakott még a user
                if (userCell.X == 1 && userCell.X == 1) {
                    //center
                    return board.GetCell(2, 2); //sarokra
                } else {
                    //nem center
                    return board.GetCell(1, 1); //középre
                }
            } else {
                //több is van neki
                return undefined;
            }
        }

    }
    private Check2(board: Board) {

    }
    private ThreatCell(board: Board, player) {

        return false
    }
}