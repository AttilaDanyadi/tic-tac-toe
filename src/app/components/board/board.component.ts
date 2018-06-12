import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Board, Cell } from '../../models/board.model';

@Component({
    selector: 'board',
    templateUrl: './board.template.html'
})
export class BoardComponent {
    @Input() Board: Board;
    @Input() ShowControls: boolean;

    @Output() CellClick = new EventEmitter<Cell>();
    @Output() btnOpenClick = new EventEmitter<string>();
    @Output() btnDeleteClick = new EventEmitter<Board>();

    private OnCellClick(cell: Cell) {
        if (cell.State == 'empty') this.CellClick.emit(cell);
    }
    private OnOpen() {
        this.btnOpenClick.emit(this.Board.Data.id);
    }
    private OnDelete() {
        this.btnDeleteClick.emit(this.Board);
    }
}