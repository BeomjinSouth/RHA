export interface Point {
  x: number;
  y: number;
}

export enum GameState {
  Idle,
  Sliding,
  Success,
}
