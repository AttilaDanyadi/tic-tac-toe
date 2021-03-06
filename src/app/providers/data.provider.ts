import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';

import { BoardData, Board } from '../models/board.model';

const API_BASE_PATH = 'http://localhost:3000/api';
const API_BOARD_PATH = API_BASE_PATH + '/boards';

@Injectable()
export class DataProvider {
    constructor(private http: Http) { }

    //Create
    public CreateBoard(boardData: BoardData) {
        let url = API_BOARD_PATH;
        return this.http.post(url, boardData);
    }

    //Read
    public GetBoard(id?: string) {
        let url = API_BOARD_PATH;
        if (id) url += "/" + id;
        return this.http.get(url)
            .map(response => {
                let json = response.json();
                let objects: BoardData[] = (id) ? [json] : json;
                let boards = objects.map(object => new Board(object));
                if (id) {
                    return (boards.length > 0) ? boards[0] : undefined;
                } else {
                    return boards;
                }
            });
    }
    public GetBoardsByNameFragment(search: string) {
        let url = API_BOARD_PATH + '?boardNameFragment=' + search;
        return this.http.get(url)
            .map(response => {
                let objects: BoardData[] = response.json();
                return objects.map(object => new Board(object));
            });
    }

    //Update
    public SaveBoard(boardData: BoardData) {
        let url = API_BOARD_PATH + '/' + boardData.id;
        return this.http.put(url, boardData);
    }

    //Delete
    public DeleteBoard(id?: string) {
        let url = API_BOARD_PATH;
        if (id) url += "/" + id;
        return this.http.delete(url);
    }
}