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
    public Board: Board;

    constructor(private dataProvider: DataProvider) { }

    ngOnInit() {
        // this.dataProvider.GetBoard().subscribe(
        //     (result: Board) => {
        //         this.log = JSON.stringify(result);
        //         console.log('get data', result);
        //     },
        //     (error) => console.log('error', error)
        // );

        this.dataProvider.GetBoard('15p7b2kjhu9o700').subscribe(
            (board: Board) => {
                console.log(board)
                this.Board = board;
            },
            (error) => console.log('error', error)
        );

        // this.dataProvider.GetBoard('htrhr').subscribe(
        //     (result: Board) => {
        //         this.log = JSON.stringify(result);
        //         console.log('get data', result);
        //     },
        //     (error) => console.log('error', error)
        // );
    }
}