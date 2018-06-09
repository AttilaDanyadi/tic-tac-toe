export interface BoardData {
    boardSize: number;
    boardName: string;
    usersCells: Array<CellData>;
    computersCells: Array<CellData>;
    id: string;
}
export interface CellData {
    col: number;
    row: number;
}

type CellState = 'empty' | 'user' | 'computer';

export class Cell {
    private _x: number;
    public get X() { return this._x; }
    private _y: number;
    public get Y() { return this._y; }

    public State: CellState;

    constructor(x: number, y: number, state?: CellState) {
        this._x = x;
        this._y = y;
        this.State = (state) ? state : 'empty';
    }
}
export class Matrix {
    private rows: Array<Array<Cell>>;

    public GetCell(x: number, y: number) {
        return this.rows[y][x];
    }

    constructor(size: number) {
        this.rows = new Array<Array<Cell>>(size);
        for (let y = 0; y < this.rows.length; y++) {
            let row = new Array<Cell>(size);
            for (let x = 0; x < row.length; x++) {
                row[x] = new Cell(x, y);
            }
            this.rows[y] = row;
        }
    }
}
export class Board {
    public Data: BoardData;
    public Matrix: Matrix;

    constructor(data: BoardData) {
        this.Data = data;
        this.Matrix = Board.CovertToMatrix(this.Data);
    }

    private static CovertToMatrix(data: BoardData) {
        let matrix = new Matrix(data.boardSize);
        for (let cell of data.usersCells) {
            matrix.GetCell(cell.col, cell.row).State= 'user';
        }
        for (let cell of data.computersCells) {
            matrix.GetCell(cell.col, cell.row).State= 'computer';
        }
        return matrix;
    }
}
