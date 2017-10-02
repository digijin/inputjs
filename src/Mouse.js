//@flow
import Point from "Point";

export default class Mouse {
	position: Point;
	down: Object;
	activity: { down: Array, up: Array };
	constructor() {
		this.activity = { down: [], up: [] };
		this.down = {};
		this.position = new Point({ x: 0, y: 0 });
		document.addEventListener("mousemove", (e: MouseEvent): void => {
			this.position = new Point({ x: e.clientX, y: e.clientY });
		});
		document.addEventListener("mousedown", (e: MouseEvent): void => {
			this.down[e.button] = true;
		});
		document.addEventListener("mouseup", (e: MouseEvent): void => {
			this.down[e.button] = false;
		});
	}
	endTick() {
		this.activity = { down: [], up: [] };
	}
}
