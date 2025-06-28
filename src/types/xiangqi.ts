
export type Player = "red" | "black";
export type PieceType = "general" | "advisor" | "elephant" | "horse" | "chariot" | "cannon" | "soldier";

export interface Piece {
  type: PieceType;
  player: Player;
}

export type BoardState = (Piece | null)[][];

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece;
}

export interface GameStats {
  wins: number;
  losses: number;
  draws: number;
  played: number;
}
