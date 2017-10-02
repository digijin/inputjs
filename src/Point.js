// @flow

export default class Point {
	x: number;
	y: number;
	constructor(pos: { x: number, y: number } = { x: 0, y: 0 }): void {
		this.x = pos.x;
		this.y = pos.y;
	}

	clone() {
		return new Point({
			x: this.x,
			y: this.y
		});
	}

	add(diff: { x: number, y: number }): Point {
		return new Point({
			x: this.x + diff.x,
			y: this.y + diff.y
		});
	}
	subtract(diff: { x: number, y: number }) {
		return new Point({
			x: this.x - diff.x,
			y: this.y - diff.y
		});
	}
}
