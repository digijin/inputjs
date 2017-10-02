//@flow

export default class Keyboard {
	down: Array<number>;
	constructor() {
		this.down = [];
		window.onkeydown = e => {
			//strip duplicates
			if (!this.getButton(e.keyCode)) {
				this.down.push(e.keyCode);
			}
		};
		window.onkeyup = e => {
			this.down.splice(this.down.indexOf(e.keyCode), 1);
		};
	}
	getButton = (key: number) => {
		return this.down.indexOf(key) > -1;
	};
	endTick() {}
}
