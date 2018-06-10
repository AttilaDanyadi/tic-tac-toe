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
export type Player = 'nobody' | 'user' | 'computer';
export type GameResult = 'nobody' | 'draw' | 'user' | 'computer';

export class Cell {
    private _x: number;
    public get X() { return this._x; }
    private _y: number;
    public get Y() { return this._y; }

    public State: CellState;

    public get CellData(): CellData {
        return { col: this.X, row: this.Y };
    }

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
    public get WinPatterLength() {
        let definied: number = this.Data['winPatterLength'];
        return (definied) ? definied : this.Data.boardSize;
    }
    public Cells: CellList;
    public Rows: Array<Array<Cell>>;

    public GetCell(x: number, y: number) {
        return this.Cells.SingleOrDefault(cell => cell.X == x && cell.Y == y);
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
    public get NextPlayer(): Player {
        if (this.GameOver) {
            return 'nobody';
        } else {
            return (this.UserCellCount <= this.ComputerCellCount)
                ? 'user'
                : 'computer';
        }
    }
    public get WinnerLine() {
        //végig megyünk az összes cellán
        for (let cell of this.Cells.ToArray()) {
            //keresünk balról jobbra vízszintesen
            let line = this.GetWinnerLineLeftRight(cell);
            if (line) return line;

            //keresünk fentről lefelé függőlegesen
            line = this.GetWinnerLineTopBottom(cell);
            if (line) return line;

            //keresünk balról jobbra átlósan lefelé
            line = this.GetWinnerLineTopLeftBottomRight(cell);
            if (line) return line;

            //keresünk jobbról balra átlósan lefelé
            line = this.GetWinnerLineTopRightBottomLeft(cell);
            if (line) return line;
        }
        //nem találtunk semmit
        return undefined;
    }
    public get GameResult(): GameResult {
        let winnerLine = this.WinnerLine;
        if (winnerLine) {
            return winnerLine.First().State as GameResult;
        } else if (this.Full) {
            return 'draw';
        } else {
            return 'nobody'
        }
    }
    public get GameOver() {
        return this.GameResult != 'nobody';
    }
    public get CanSave() {
        return !this.Empty && this.NextPlayer != 'computer';
    }


    public ExportData(): BoardData {
        let usersCells = new Array<CellData>();
        let computersCells = new Array<CellData>();
        this.Cells.ForEach(cell => {
            switch (cell.State) {
                case 'user':
                    usersCells.push(cell.CellData);
                    break;
                case 'computer':
                    computersCells.push(cell.CellData);
                    break;
                default:
                    break;
            }
        });
        return {
            boardSize: this.Data.boardSize,
            boardName: this.Data.boardName,
            usersCells: usersCells,
            computersCells: computersCells,
            id: this.Data.id
        };
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
        this.Data.usersCells.forEach(cellData =>
            this.GetCell(cellData.col, cellData.row).State = 'user'
        );
        this.Data.computersCells.forEach(cellData =>
            this.GetCell(cellData.col, cellData.row).State = 'computer'
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

    private GetWinnerLineLeftRight(fromCell: Cell) {
        return this.GetWinnerLine(
            i => fromCell.X + i,
            i => fromCell.Y
        );
    }
    private GetWinnerLineTopBottom(fromCell: Cell) {
        return this.GetWinnerLine(
            i => fromCell.X,
            i => fromCell.Y + i
        );
    }
    private GetWinnerLineTopLeftBottomRight(fromCell: Cell) {
        return this.GetWinnerLine(
            i => fromCell.X + i,
            i => fromCell.Y + i
        );
    }
    private GetWinnerLineTopRightBottomLeft(fromCell: Cell) {
        return this.GetWinnerLine(
            i => fromCell.X - i,
            i => fromCell.Y + i
        );
    }
    private GetWinnerLine(
        xTransformer: (i: number) => number,
        yTransformer: (i: number) => number
    ) {
        //kigyűjtjük a cellától adott irányban lévő "3 vagyis WinPatterLength" cellát egy listába
        let line = new List<Cell>();
        for (let i = 0; i < this.WinPatterLength; i++) {
            line.Add(this.GetCell(xTransformer(i), yTransformer(i)));
        }
        return (Board.PatternIsWinner(line)) ? line : undefined;
    }
    private static PatternIsWinner(line: List<Cell>) {
        return (line.Count(cell => cell === undefined || cell.State == 'empty') > 0)
            //Ha a vonalban van olyan cella ami kilóg a tábláról vagy üres akkor nem jó
            ? false
            //Ha a vonal minden eleme user vagy minden eleme computer akkor van találat
            : line.TrueForAll(cell => cell.State == 'user') || line.TrueForAll(cell => cell.State == 'computer');
    }
}
