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
            })
            .catch((err: Response, caught) => {
                if (err.status == 404) {
                    let res = (id) ? undefined : new Array<Board>();
                    return Observable.from([res]);
                }
                else {
                    throw err;
                }
            });
    }
    public GetBoardsByNameFragment(search: string) {
        let url = API_BOARD_PATH + '?boardNameFragment=' + search;
        return this.http.get(url)
            .delay(1000)
            .map(response => {
                let objects: BoardData[] = response.json();
                return objects.map(object => new Board(object));
            });
    }

    //Update

    //Delete
    public DeleteBoard(id?: string) {
        let url = API_BOARD_PATH;
        if (id) url += "/" + id;
        return this.http.delete(url)
            .map(response => {
                return response;
            });
            // .catch((err: Response, caught) => {
            //     if (err.status == 404) {
            //         let res = (id) ? undefined : new Array<Board>();
            //         return Observable.from([err.]);
            //     }
            //     else {
            //         throw err;
            //     }
            // });
    }
}