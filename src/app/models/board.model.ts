export interface BoardData {
    boardSize: number;
    boardName?: string;
    usersCells: Array<CellData>;
    computersCells: Array<CellData>;
    id?: string;
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
    public Rows: Array<Array<Cell>>;

    public GetCell(x: number, y: number) {
        return this.Rows[y][x];
    }

    constructor(size: number) {
        this.Rows = new Array<Array<Cell>>(size);
        for (let y = 0; y < this.Rows.length; y++) {
            let row = new Array<Cell>(size);
            for (let x = 0; x < row.length; x++) {
                row[x] = new Cell(x, y);
            }
            this.Rows[y] = row;
        }
    }
}
export class Board {
    public Data: BoardData;
    public Matrix: Matrix;

    constructor(data?: BoardData) {
        if (data) {
            this.Data = data;
        } else {
            this.Data = {
                boardSize: 3,
                usersCells: new Array<CellData>(),
                computersCells: new Array<CellData>(),
            };
        }
        this.Matrix = Board.CovertToMatrix(this.Data);
    }

    private static CovertToMatrix(data: BoardData) {
        let matrix = new Matrix(data.boardSize);
        for (let cell of data.usersCells) {
            matrix.GetCell(cell.col, cell.row).State = 'user';
        }
        for (let cell of data.computersCells) {
            matrix.GetCell(cell.col, cell.row).State = 'computer';
        }
        return matrix;
    }
}
