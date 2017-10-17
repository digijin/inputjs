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
	axes: { [string]: Array<Object> };
	keyboardMapping: { [string]: number };
	gamepadMapping: { [string]: number };
	mouseMapping: { [string]: number };
	buttons: { [string]: Array<{ type: string }> };
	constructor(config: Object = {}) {
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
		if (this.keyboardMapping.hasOwnProperty(key))
			return this.keyboardMapping[key];
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
	button(key: string | number): Array<{ type: string }> {
		if (typeof key === "number") return [];
		if (this.buttons[key]) return this.buttons[key];
		// return parseInt(key);
		throw new Error("cant find button " + key);
	}
	getAxis(axis: string): number {
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
		return 0;
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
	// getJoystickNames() {}
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
		return (
			this.keyboard.activity.down.indexOf(this.mapKeyboard(keyCode)) > -1
		);
	}

	getKeyUp(keyCode: string | number) {
		return (
			this.keyboard.activity.up.indexOf(this.mapKeyboard(keyCode)) > -1
		);
	}
	getMouseButton(button: string | number): boolean {
		return this.mouse.down[this.mapMouse(button)] || false;
	}
	getMouseButtonDown(button: string | number): boolean {
		return this.mouse.activity.down.indexOf(this.mapMouse(button)) > -1;
	}
	getMouseButtonUp(button: string | number): boolean {
		return this.mouse.activity.up.indexOf(this.mapMouse(button)) > -1;
	}
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
