import { Component,Input ,Output,EventEmitter} from '@angular/core';
import { Board } from '../../models/board.model';

@Component({
    selector: 'board',
    templateUrl: './board.template.html'
})
export class BoardComponent{
    @Input() Board: Board;
    @Input() ShowSave: boolean;
    @Input() ShowOpen: boolean;
    @Input() ShowDelete: boolean;

    @Output() btnSaveClick = new EventEmitter<Board>();
    @Output() btnOpenClick = new EventEmitter<string>();
    @Output() btnDeleteClick = new EventEmitter<string>();

    private OnSave(){
        this.btnSaveClick.emit(this.Board);
    }
    private OnOpen(){
        this.btnOpenClick.emit(this.Board.Data.id);
    }
    private OnDelete(){
        this.btnDeleteClick.emit(this.Board.Data.id);
    }
}