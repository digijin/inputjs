//@flow

import Mouse from "Mouse";
import KB from "Keyboard";
export let Keyboard = KB;
import GamePad from "GamePad";

import defaults from "defaults";

const defaultConfig = {
	axes: {
		horizontal: {
			positive: "right",
			negative: "left"
		},
		vertical: {
			positive: "up",
			negative: "down"
		}
	},
	mapping: {
		left: 37,
		up: 38,
		right: 39,
		down: 40,
		shift: 16,
		enter: 13,
		ctrl: 17,
		escape: 27,
		space: 32
	}
};

export default class Input {
	mouse: Mouse;
	keyboard: Keyboard;
	gamepad: GamePad;
	constructor() {
		this.axes = defaultConfig.axes;
		this.mapping = defaultConfig.mapping;
		this.mouse = new Mouse();
		this.keyboard = new Keyboard();
		this.gamepad = new GamePad();
	}
	endTick() {
		this.mouse.endTick();
		this.keyboard.endTick();
		this.gamepad.endTick();
	}
	map(key: string | number): number {
		if (typeof key === "number") return key;
		if (this.mapping[key]) return this.mapping[key];
		return parseInt(key);
	}
	getAxis(axis: string) {
		let pos = this.getKey(this.axes[axis].positive);
		let neg = this.getKey(this.axes[axis].negative);
		return (pos ? 1 : 0) + (neg ? -1 : 0);
	}
	getButton() {}
	getButtonDown() {}
	getButtonUp() {}
	getJoystickNames() {}
	getKey(keyCode: string | number) {
		keyCode = this.map(keyCode);
		// if (this.keyStatus.hasOwnProperty(keyCode))
		// 	return this.keyStatus[keyCode];
		if (this.keyboard.down.indexOf(keyCode) !== -1) {
			return true;
		}
		return false;
	}

	getKeyDown(keyCode: string | number) {
		keyCode = this.map(keyCode);
		if (this.keyChanged.hasOwnProperty(keyCode)) {
			if (this.keyChanged[keyCode] === "down") {
				return true;
			}
		}
		return false;
	}

	getKeyUp(keyCode) {
		keyCode = this.map(keyCode);
		if (this.keyChanged.hasOwnProperty(keyCode)) {
			if (this.keyChanged[keyCode] === "up") {
				return true;
			}
		}
		return false;
	}
	getMouseButton() {}
	getMouseButtonDown() {}
	getMouseButtonUp() {}
}
