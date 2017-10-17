//@flow

import M from "Mouse";
export let Mouse = M;
import KB from "Keyboard";
export let Keyboard = KB;
import GP from "GamePad";
export let GamePad = GP;

import defaults from "defaults";

export default class Input {
	mouse: Mouse;
	keyboard: Keyboard;
	gamepad: GamePad;
	constructor(config = {}) {
		config = Object.assign({}, defaults, config);
		this.axes = config.axes;
		this.keyboardMapping = config.keyboardMapping;
		this.gamepadMapping = config.gamepadMapping;
		this.mouseMapping = config.mouseMapping;
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
	mapKeyboard(key: string | number): number {
		if (typeof key === "number") return key;
		if (this.keyboardMapping[key]) return this.keyboardMapping[key];
		return parseInt(key);
	}
	mapMouse(key: string | number): number {
		if (typeof key === "number") return key;
		if (this.mouseMapping.hasOwnProperty(key))
			return this.mouseMapping[key];
		return parseInt(key);
	}
	mapGamepad(key: string | number): number {
		if (typeof key === "number") return key;
		if (this.gamepadMapping.hasOwnProperty(key))
			//value can be zero so using hasOwnProperty
			return this.gamepadMapping[key];
		return parseInt(key);
	}
	button(key: string | number): number {
		if (typeof key === "number") return key;
		if (this.buttons[key]) return this.buttons[key];
		// return parseInt(key);
		throw new Error("cant find button " + key);
	}
	getAxis(axis: string) {
		let axes = this.axes[axis];
		for (let i = 0; i < axes.length; i++) {
			if (this.getDevice() == "gamepad") {
				if (axes[i].type == "gamepad") {
					return this.gamepad.getGamePad().axes[axes[i].axis];
				}
			} else {
				if (axes[i].type == "keyboard") {
					let pos = this.getKey(axes[i].positive);
					let neg = this.getKey(axes[i].negative);
					return (pos ? 1 : 0) + (neg ? -1 : 0);
				}
			}
		}
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
						if (this.getDevice() == "gamepad")
							return this.getGamePadButton(button.button);
						break;
					case "keyboard":
						if (this.getDevice() !== "gamepad")
							return this.getKey(button.key);
						break;
					case "mouse":
						if (this.getDevice() !== "gamepad")
							return this.getMouseButton(button.button);
						break;
				}
				return 0;
			})
			.reduce((a, b) => a + b);
	}
	getGamePadButton(button: string | number): number {
		let gp = this.gamepad.getGamePad();
		if (gp) {
			return gp.buttons[this.mapGamepad(button)].value;
		}
		return 0;
	}
	getButtonDown() {}
	getButtonUp() {}
	getJoystickNames() {}
	getKey(keyCode: string | number) {
		keyCode = this.mapKeyboard(keyCode);
		// if (this.keyStatus.hasOwnProperty(keyCode))
		// 	return this.keyStatus[keyCode];
		if (this.keyboard.down.indexOf(keyCode) !== -1) {
			return true;
		}
		return false;
	}

	getKeyDown(keyCode: string | number) {
		keyCode = this.mapKeyboard(keyCode);
		if (this.keyChanged.hasOwnProperty(keyCode)) {
			if (this.keyChanged[keyCode] === "down") {
				return true;
			}
		}
		return false;
	}

	getKeyUp(keyCode) {
		keyCode = this.mapKeyboard(keyCode);
		if (this.keyChanged.hasOwnProperty(keyCode)) {
			if (this.keyChanged[keyCode] === "up") {
				return true;
			}
		}
		return false;
	}
	getMouseButton(button: string | number): boolean {
		return this.mouse.down[this.mapMouse(button)] || false;
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
	getDevice() {
		return this.getLastActivityDevice();
	}
}
