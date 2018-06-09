import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map'

import { BoardData, Board } from '../models/board.model';

const API_BASE_PATH = 'http://localhost:3000/api';
const API_BOARD_PATH = API_BASE_PATH + '/boards';

@Injectable()
export class DataProvider {
    constructor(private http: Http) { }

    public GetBoard(id?: string) {
        let url = API_BOARD_PATH;
        if (id) url += "/'" + id + "'";
        console.log(url, 'url')
        return this.http.get(API_BOARD_PATH)
            .map(response => {
                console.log(response.status)
                if (response.status == 404) {
                    console.log('404')
                    return (id) ? undefined : new Array<Board>();
                }

                let json = response.json();
                let isArray = Array.isArray(json);
                let objects: Array<BoardData> = (isArray) ? json : [json];
                let boards = new Array<Board>();
                for (let object of objects) {
                    boards.push(new Board(object));
                }
                if (isArray) {
                    return boards;
                } else {
                    return (boards.length > 0) ? boards[0] : undefined;
                }
            });
    }
}