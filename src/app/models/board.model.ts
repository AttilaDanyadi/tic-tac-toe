import { List } from '../lib/collections';
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

export type CellState = 'empty' | 'user' | 'computer';
type NextPlayer = 'nobody' | 'user' | 'computer';

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
export class CellList extends List<Cell>{
    constructor(boardSize: number) {
        super();
        for (let y = 0; y < boardSize; y++) {
            for (let x = 0; x < boardSize; x++) {
                this.Add(new Cell(x, y, 'empty'));
            }
        }
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
    public Cells: CellList;

    public get Empty() {
        return this.Cells.TrueForAll(cell => cell.State == 'empty');
    }
    public get Full() {
        return this.Cells.TrueForAll(cell => cell.State != 'empty');
    }
    public get UserCellCount() {
        return this.Cells.Count(cell => cell.State == 'user');
    }
    public get ComputerCellCount() {
        return this.Cells.Count(cell => cell.State == 'computer');
    }
    public get NextPlayer(): NextPlayer {
        if (this.GameOver) {
            return 'nobody';
        } else {
            return (this.UserCellCount <= this.ComputerCellCount)
                ? 'user'
                : 'computer';
        }
    }
    public get GameOver() {
        return this.Full;
    }

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
        this.Cells = new CellList(this.Data.boardSize);
        this.FillCellList();
        this.FillMatrix();
    }

    private FillCellList() {
        for (let cellData of this.Data.usersCells) {
            this.Cells.Single(i => i.X == cellData.col && i.Y == cellData.row).State = 'user';
        }
        for (let cellData of this.Data.computersCells) {
            this.Cells.Single(i => i.X == cellData.col && i.Y == cellData.row).State = 'computer';
        }
    }
    private FillMatrix() {
        this.Matrix = new Matrix(this.Data.boardSize);
        this.Matrix.Rows.forEach(row => row.forEach(cell =>
            cell = this.Cells.Single(c => c.X == cell.X && c.Y == cell.Y)
        ));
    }
}
