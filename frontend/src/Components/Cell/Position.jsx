export class Position {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  toObject() {
    return {
      x: this.x,
      y: this.y,
    };
  }
}
