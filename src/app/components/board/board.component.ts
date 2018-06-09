import { Component,Input } from '@angular/core';
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
}