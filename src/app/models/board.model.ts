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

export type CellState = 'empty' | 'x' | 'o';
export type Player = 'nobody' | 'x' | 'o';
export type GameResult = 'nobody' | 'draw' | 'x' | 'o';

export class Cell {
    private _x: number;
    public get X() { return this._x; }
    private _y: number;
    public get Y() { return this._y; }

    public State: CellState;
    public get IsCenter() {
        return this.X == 1 && this.Y == 1;
    }

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
    public Changed = false;

    public get WinPatterLength() {
        let definied: number = this.Data['winPatterLength'];
        return (definied) ? definied : this.Data.boardSize;
    }
    public Cells: CellList;
    public Rows: Array<Array<Cell>>;
    public LinePatterns: List<List<Cell>>;
    public CrossPatterns: List<List<Cell>>;
    public Patterns: List<List<Cell>>;

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
        return this.Cells.Count(cell => cell.State == 'x');
    }
    public get ComputerCellCount() {
        return this.Cells.Count(cell => cell.State == 'o');
    }
    public get NextPlayer(): Player {
        if (this.GameOver) {
            return 'nobody';
        } else {
            return (this.UserCellCount <= this.ComputerCellCount)
                ? 'x'
                : 'o';
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
        return this.Changed && !this.Empty && this.NextPlayer != 'o';
    }

    public GetAttacks(player: Player) {
        return this.Patterns.Where(pattern =>
            pattern.Count(cell => cell.State == player) == 2 &&
            pattern.Count(cell => cell.State == 'empty') == 1
        );
    }
    public GetPossibleAttacks(player: Player) {
        return this.Patterns.Where(pattern =>
            pattern.Count(cell => cell.State == player) == 1 &&
            pattern.Count(cell => cell.State == 'empty') == 2
        );
    }
    public GetPossibleDubleAttackCells(player: Player) {
        let cells = new List<Cell>();
        this.Cells
            .Where(cell => cell.State == 'empty')
            .ForEach(emptyCell => {
                let clone = this.Clone();
                clone.GetCell(emptyCell.X, emptyCell.Y).State = player as CellState;
                let attacks = clone.GetAttacks(player);
                if (attacks.Count() > 1) cells.Add(emptyCell);
            });
        return cells;
    }
    public static GetWinnerCellOfAttack(attack: List<Cell>) {
        return attack.Single(cell => cell.State == 'empty');
    }

    constructor(data?: BoardData) {
        this.ImportData(data);
    }
    private ImportData(data?: BoardData) {
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
        this.FillPatterns();
    }
    public ExportData(): BoardData {
        let usersCells = new Array<CellData>();
        let computersCells = new Array<CellData>();
        this.Cells.ForEach(cell => {
            switch (cell.State) {
                case 'x':
                    usersCells.push(cell.CellData);
                    break;
                case 'o':
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
    public Clone() {
        return new Board(JSON.parse(JSON.stringify(this.ExportData())));
    }

    private FillCellList() {
        this.Data.usersCells.forEach(cellData =>
            this.GetCell(cellData.col, cellData.row).State = 'x'
        );
        this.Data.computersCells.forEach(cellData =>
            this.GetCell(cellData.col, cellData.row).State = 'o'
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
    private FillPatterns() {
        let pattern: List<Cell>;

        this.LinePatterns = new List<List<Cell>>();
        for (let y = 0; y < this.Data.boardSize; y++) {
            pattern = new List<Cell>();
            for (let x = 0; x < this.Data.boardSize; x++) {
                pattern.Add(this.GetCell(x, y));
            }
            this.LinePatterns.Add(pattern);
        }

        for (let x = 0; x < this.Data.boardSize; x++) {
            pattern = new List<Cell>();
            for (let y = 0; y < this.Data.boardSize; y++) {
                pattern.Add(this.GetCell(x, y));
            }
            this.LinePatterns.Add(pattern);
        }

        this.CrossPatterns = new List<List<Cell>>();
        pattern = new List<Cell>();
        for (let i = 0; i < this.Data.boardSize; i++) {
            pattern.Add(this.GetCell(i, i));
        }
        this.CrossPatterns.Add(pattern);

        pattern = new List<Cell>();
        for (let i = 0; i < this.Data.boardSize; i++) {
            pattern.Add(this.GetCell(i, this.Data.boardSize - 1 - i));
        }
        this.CrossPatterns.Add(pattern);

        this.Patterns = new List<List<Cell>>();
        this.Patterns.AddList(this.LinePatterns);
        this.Patterns.AddList(this.CrossPatterns);
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
            : line.TrueForAll(cell => cell.State == 'x') || line.TrueForAll(cell => cell.State == 'o');
    }
}
