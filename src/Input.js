//@flow

import M from "Mouse";
export let Mouse = M;
import KB from "Keyboard";
export let Keyboard = KB;
import GP from "GamePad";
export let GamePad = GP;

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
	},
	buttons: {
		jump: [{ type: "gamepad", button: 0 }, { type: "keyboard", key: 32 }],
		special: [{ type: "gamepad", button: 1 }, { type: "mouse", button: 2 }],
		fire: [
			{ type: "gamepad", button: 2 },
			{ type: "keyboard", key: "ctrl" },
			{ type: "mouse", button: 0 }
		]
	}
};

export default class Input {
	mouse: Mouse;
	keyboard: Keyboard;
	gamepad: GamePad;
	constructor(config = {}) {
		config = Object.assign({}, defaultConfig, config);
		this.axes = config.axes;
		this.mapping = config.mapping;
		this.buttons = config.buttons;
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
	button(key: string | number): number {
		if (typeof key === "number") return key;
		if (this.buttons[key]) return this.buttons[key];
		// return parseInt(key);
		throw new Error("cant find button " + key);
	}
	getAxis(axis: string) {
		let pos = this.getKey(this.axes[axis].positive);
		let neg = this.getKey(this.axes[axis].negative);
		return (pos ? 1 : 0) + (neg ? -1 : 0);
	}
	getButton(buttonName: string) {
		let buttons = this.button(buttonName);
		if (!Array.isArray(buttons)) {
			buttons = [buttons];
		}
		//forced arrays
		let value = false;
		return buttons
			.map(button => {
				switch (button.type) {
					case "gamepad":
						return this.getGamePadButton(button.button);
						break;
					case "keyboard":
						return this.getKey(button.key);
						break;
					case "mouse":
						return this.getMouseButton(button.button);
						break;
				}
				return 0;
			})
			.reduce((a, b) => a + b);
	}
	getGamePadButton(button): number {
		let gp = this.gamepad.getGamePad();
		if (gp) {
			return gp.buttons[button].value;
		}
		return 0;
	}
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
	getMouseButton(button): boolean {
		return this.mouse.down[button] || false;
	}
	getMouseButtonDown() {}
	getMouseButtonUp() {}
	getLastActivityDevice(): "mouse" | "keyboard" | "gamepad" {
		if (
			this.gamepad.lastAction >
			Math.max(this.keyboard.lastAction, this.mouse.lastAction)
		) {
			return "gamepad";
		} else if (this.keyboard.lastAction > this.mouse.lastAction) {
			return "keyboard";
		} else {
			return "mouse";
		}
	}
}
