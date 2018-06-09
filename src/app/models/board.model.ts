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

type CellState = "empty" | "user" | "computer"

export class Matrix {
    private rows: Array<Array<CellState>>;

    public GetCellState(x: number, y: number) {
        return this.rows[y][x];
    }
    public SetCellState(x: number, y: number, state: CellState) {
        this.rows[y][x] = state;
    }

    constructor(size: number) {
        this.rows = new Array<Array<CellState>>(size);
        for (let y = 0; y < this.rows.length; y++) {
            let row = new Array<CellState>(size);
            for (let x = 0; x < row.length; x++) {
                row[x] = "empty";
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
            matrix.SetCellState(cell.col, cell.row, "user");
        }
        for (let cell of data.computersCells) {
            matrix.SetCellState(cell.col, cell.row, "computer");
        }
        return matrix;
    }
}
