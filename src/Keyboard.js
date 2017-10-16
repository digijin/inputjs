//@flow

export default class Keyboard {
	down: Array<number>;
	activity: { down: Array<number>, up: Array<number> };
	lastAction: number;
	constructor() {
		this.activity = { down: [], up: [] };
		this.down = [];
		this.lastAction = 0;
		window.onkeydown = e => {
			//strip duplicates
			this.action();
			if (!this.getButton(e.keyCode)) {
				this.down.push(e.keyCode);
				this.activity.down.push(e.keyCode);
			}
		};
		window.onkeyup = e => {
			this.action();
			this.down.splice(this.down.indexOf(e.keyCode), 1);
			this.activity.up.push(e.keyCode);
		};
	}
	action() {
		this.lastAction = new Date().getTime();
	}
	getButton = (key: number) => {
		return this.down.indexOf(key) > -1;
	};
	endTick() {
		this.activity = { down: [], up: [] };
	}
}
