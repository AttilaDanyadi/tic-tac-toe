import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { DataProvider } from '../../providers/data.provider';
import { BoardData, Board } from '../../models/board.model';

@Component({
    selector: '[test]',
    templateUrl: './test.page.html',
    encapsulation: ViewEncapsulation.None
})
export class TestPage implements OnInit {
    public log: string;

    constructor(private dataProvider: DataProvider) { }

    ngOnInit() {

        this.dataProvider.GetBoard('98cyh0wf5sjhtnw6nd').subscribe(
            (result: Board) => {
                this.log = JSON.stringify(result.Data);
                console.log(result);
            });
    }
}