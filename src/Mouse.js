//@flow
import Point from "./Point";

export default class Mouse {
	position: Point;
	down: Object;
	activity: {
		down: Array<number>,
		up: Array<number>,
		wheelDelta: { x: number, y: number }
	};
	lastAction: number;
	target: Object;
	constructor(target: Object = document) {
		this.target = target;
		this.activity = { down: [], up: [], wheelDelta: { x: 0, y: 0 } };
		this.down = {};
		this.lastAction = 0;
		this.position = new Point({ x: 0, y: 0 });
		target.addEventListener("mousemove", (e: MouseEvent): void => {
			this.position = new Point({ x: e.clientX, y: e.clientY });
			this.action();
		});

		["up", "down"].forEach(dir => {
			target.addEventListener("mouse" + dir, (e: MouseEvent): void => {
				this.down[e.button] = dir == "down";

				this.activity[dir].push(e.button);
				this.action();
			});
		});

		target.addEventListener("wheel", (e: MouseEvent): void => {
			this.activity.wheelDelta.x += e.deltaX;
			this.activity.wheelDelta.y += e.deltaY;
		});
	}
	action() {
		this.lastAction = new Date().getTime();
	}
	endTick() {
		this.activity = { down: [], up: [], wheelDelta: { x: 0, y: 0 } };
	}
}
