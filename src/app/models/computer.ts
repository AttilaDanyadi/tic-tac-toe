import { Board, Cell, Player } from "../models/board.model";
export class Computer {
    private Board: Board;
    private Me: Player;
    private Opponent: Player;

    private get MyThreats() { return this.Board.GetAttacks(this.Opponent); }
    private get MyAttacks() { return this.Board.GetAttacks(this.Me); }
    private get MyPossibleHVAttacks() {
        return this.Board.GetPossibleAttacks(this.Me).Where(attack => {
            let first = attack.First();
            return attack.TrueForAll(cell => cell.X == first.X) ||
                attack.TrueForAll(cell => cell.Y == first.Y)
        });
    }
    private get MyPossibleCrossAttacks() {
        return this.Board.GetPossibleAttacks(this.Me).Where(attack => {
            return attack.TrueForAll(cell => cell.X == cell.Y)
        });
    }

    constructor(board: Board, youAre: Player) {
        this.Board = board;
        this.Me = youAre;
        this.Opponent = (this.Me == 'x') ? 'o' : 'x';
    }

    public Put() {
        let choice = this.HaUres();
        if (!choice) choice = this.HaCsakEgyJelVan();
        if (!choice) choice = this.HaTudokNyerni();
        if (!choice) choice = this.HaFenyeget();
        if (!choice) choice = this.HaTudnaDuplanFenyegetni();
        if (!choice) choice = this.GetFirstEmptyCell();
        return choice;
    }
    private GetFirstEmptyCell() {
        return this.Board.Cells.FirstOrDefault(cell => cell.State == 'empty');
    }
    private HaUres() {
        return (this.Board.Empty) ? this.Board.GetCell(0, 2) : undefined;
    }
    private HaCsakEgyJelVan() {
        let cell = this.Board.Cells.SingleOrDefault(cell => cell.State != 'empty');
        return (cell)
            ? (cell.IsCenter) ? this.Board.GetCell(2, 2) : this.Board.GetCell(1, 1)
            : undefined;
    }
    private HaTudokNyerni() {
        let attack = this.MyAttacks.FirstOrDefault();
        return  (attack)
            ? Board.GetWinnerCellOfAttack(attack)
            : undefined;
    }
    private HaFenyeget() {
        let threatens = this.MyThreats.FirstOrDefault();
        return (threatens)
            ? Board.GetWinnerCellOfAttack(threatens)
            : undefined;
    }
    private HaTudnaDuplanFenyegetni() {
        let cells = this.Board.GetPossibleDubleAttackCells(this.Opponent);
        return (cells.Count() > 0)
            ? this.Fenyegesd()
            : this.HaTudnamDuplanFenyegetni();
    }
    private HaTudnamDuplanFenyegetni() {
        let cells = this.Board.GetPossibleDubleAttackCells(this.Me);
        return (cells.Count() > 0)
            ? cells.First()
            : this.Fenyegesd();
    }
    private Fenyegesd() {
        let firstAttack = this.MyPossibleHVAttacks.FirstOrDefault();
        if (firstAttack) return firstAttack.First(cell => cell.State == 'empty');
        firstAttack = this.MyPossibleCrossAttacks.FirstOrDefault();
        return (firstAttack)
            ? firstAttack.First(cell => cell.State == 'empty')
            : this.GetFirstEmptyCell();
    }
}