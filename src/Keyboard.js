//@flow

export default class Keyboard {
	down: Array<number>;
	activity: { down: Array, up: Array };
	constructor() {
		this.activity = { down: [], up: [] };
		this.down = [];
		window.onkeydown = e => {
			//strip duplicates
			if (!this.getButton(e.keyCode)) {
				this.down.push(e.keyCode);
			}
			this.activity.down.push(e.keyCode);
		};
		window.onkeyup = e => {
			this.down.splice(this.down.indexOf(e.keyCode), 1);
			this.activity.up.push(e.keyCode);
		};
	}
	getButton = (key: number) => {
		return this.down.indexOf(key) > -1;
	};
	endTick() {
		this.activity = { down: [], up: [] };
	}
}
