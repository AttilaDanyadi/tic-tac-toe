import { Component,Input } from '@angular/core';
import { Cell } from '../../models/board.model';

@Component({
    selector: 'cell',
    templateUrl: './cell.template.html'
})
export class CellComponent{
    @Input() Cell: Cell;
}