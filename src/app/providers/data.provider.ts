import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

import { BoardData, Board } from '../models/board.model';

const API_BASE_PATH = 'http://localhost:3000/api';
const API_BOARD_PATH = API_BASE_PATH + '/boards';

@Injectable()
export class DataProvider {
    constructor(private http: Http) { }

    public GetBoard(id?: string) {
        let url = API_BOARD_PATH;
        if (id) url += "/" + id;
        return this.http.get(url)
            .map(response => {
                let json = response.json();
                let objects: Array<BoardData> = (id) ? [json] : json;
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

    // public GetBoardsByNameFragment(search:string){
    //     let url = API_BOARD_PATH+'?boardNameFragment='+search;
    //     console.log(url, 'url')
    //     return this.http.get(API_BOARD_PATH)
    //         .map(response => {
    //             console.log(response.status)
    //             if (response.status == 404) {
    //                 console.log('404')
    //                 return (id) ? undefined : new Array<Board>();
    //             }

    //             let json = response.json();
    //             let isArray = Array.isArray(json);
    //             let objects: Array<BoardData> = (isArray) ? json : [json];
    //             let boards = new Array<Board>();
    //             for (let object of objects) {
    //                 boards.push(new Board(object));
    //             }
    //             if (isArray) {
    //                 return boards;
    //             } else {
    //                 return (boards.length > 0) ? boards[0] : undefined;
    //             }
    //         });
    // }
}