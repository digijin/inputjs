export default class GamePad {
	gamepads: Object;
	timestamp: number;
	lastAction: number;
	constructor() {
		this.lastAction = 0; //never
		this.timestamp = 0;
		this.updateGamepads();
	}
	endTick() {
		this.updateGamepads();
	}
	updateGamepads() {
		if (navigator.getGamepads) {
			this.gamepads = navigator.getGamepads();
			let gp = this.getGamePad();
			if (gp) {
				if (gp.timestamp !== this.timestamp) {
					this.timestamp = gp.timestamp;
					this.lastAction = new Date().getTime();
				}
			}
		}
	}
	getGamePad() {
		let gp;
		for (let i = 0; i < this.gamepads.length; i++) {
			gp = gp || this.gamepads[i];
		}
		return gp;
	}
}
