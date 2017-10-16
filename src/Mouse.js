//@flow
import Point from "Point";

export default class Mouse {
	position: Point;
	down: Object;
	activity: { down: Array, up: Array };
	lastAction: number;
	constructor() {
		this.activity = { down: [], up: [] };
		this.down = {};
		this.lastAction = 0;
		this.position = new Point({ x: 0, y: 0 });
		document.addEventListener("mousemove", (e: MouseEvent): void => {
			this.position = new Point({ x: e.clientX, y: e.clientY });
			this.action();
		});
		document.addEventListener("mousedown", (e: MouseEvent): void => {
			this.down[e.button] = true;

			this.activity.down.push(e.button);
			this.action();
		});
		document.addEventListener("mouseup", (e: MouseEvent): void => {
			this.down[e.button] = false;

			this.activity.up.push(e.button);
			this.action();
		});
	}
	action() {
		this.lastAction = new Date().getTime();
	}
	endTick() {
		this.activity = { down: [], up: [] };
	}
}
