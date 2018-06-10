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

export class Board {
    public Data: BoardData;
    public Cells: CellList;
    public Rows: Array<Array<Cell>>;

    public GetCell(x: number, y: number) {
        return this.Cells.Single(cell => cell.X == x && cell.Y == y);
    }

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
        this.FillRows();
    }

    private FillCellList() {
        this.Data.usersCells.forEach(cellData=>
            this.GetCell(cellData.col,cellData.row).State = 'user'
        );
        this.Data.computersCells.forEach(cellData=>
            this.GetCell(cellData.col,cellData.row).State = 'computer'
        );
    }
    private FillRows() {
        this.Rows = new Array<Array<Cell>>();
        for (let y = 0; y < this.Data.boardSize; y++) {
            let row = new Array<Cell>();
            for (let x = 0; x < this.Data.boardSize; x++) {
                row.push(this.GetCell(x, y))
            }
            this.Rows.push(row);
        }
    }
}
