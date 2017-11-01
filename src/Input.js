//@flow

import M from "./Mouse";
export let Mouse = M;
import KB from "./Keyboard";
export let Keyboard = KB;
import GP from "./GamePad";
export let GamePad = GP;

import defaults from "./defaults";
/**
 * The main Input class
 */
type ButtonType = { type: string, button: number, key: number };
export default class Input {
	mouse: Mouse;
	keyboard: Keyboard;
	gamepad: GamePad;
	axes: { [string]: Array<Object> };
	keyboardMapping: { [string]: number };
	gamepadMapping: { [string]: number };
	mouseMapping: { [string]: number };
	buttons: {
		[string]: Array<ButtonType>
	};

	/**
	 * Constructor
	 * @param {Object} config - mapping and button/axis configuration
	 */
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
	/**
	 * To be called at the end of each game tick to clear activity 
	 */
	endTick() {
		this.mouse.endTick();
		this.keyboard.endTick();
		this.gamepad.endTick();
	}
	/**
	 * maps a string or number to a keycode
	 * @param {string|number} key 
	 * @return {number} value
	 */
	mapKeyboard(key: string | number): number {
		if (typeof key === "number") return key;
		if (this.keyboardMapping.hasOwnProperty(key))
			return this.keyboardMapping[key];
		return parseInt(key);
	}
	/**
	 * maps a string or number to a mouse button
	 * @param {string|number} key 
	 * @return {number} value
	 */
	mapMouse(key: string | number): number {
		if (typeof key === "number") return key;
		if (this.mouseMapping.hasOwnProperty(key))
			return this.mouseMapping[key];
		return parseInt(key);
	}
	/**
	 * MAps a string or number to a gamepad button
	 * @param {string|number} key 
	 * @return {number} value
	 */
	mapGamepad(key: string | number): number {
		if (typeof key === "number") return key;
		if (this.gamepadMapping.hasOwnProperty(key))
			//value can be zero so using hasOwnProperty
			return this.gamepadMapping[key];
		return parseInt(key);
	}
	/**
	 * returns button configuration for a key
	 * @param {string|number} key 
	 * @return {Array} value
	 */
	button(key: string | number): Array<ButtonType> {
		if (typeof key === "number") return [];
		if (this.buttons[key]) return this.buttons[key];
		// return parseInt(key);
		throw new Error("cant find button " + key);
	}
	/**
	 * returns the value for the state of the current axis
	 * @param {string} axis 
	 * @return {number} value
	 */
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
	/**
	 * gets value for button name dependent on active device
	 * @param {string} buttonName 
	 * @return {number} value
	 */
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
	/**
	 * gets value of a gamepad button
	 * @param {string|number} button 
	 * @return {number} value
	 */
	getGamePadButton(button: string | number): number {
		let gp = this.gamepad.getGamePad();
		if (gp) {
			return gp.buttons[this.mapGamepad(button)].value;
		}
		return 0;
	}
	/**
	 * not implemented
	 */
	getButtonDown() {}

	/**
	 * not implemented
	 */
	getButtonUp() {}
	/**
	 * gets whether key is currently presseed
	 * @param {string|number} keyCode 
	 * @return {boolean} state
	 */
	getKey(keyCode: string | number): boolean {
		keyCode = this.mapKeyboard(keyCode);
		// if (this.keyStatus.hasOwnProperty(keyCode))
		// 	return this.keyStatus[keyCode];
		if (this.keyboard.down.indexOf(keyCode) !== -1) {
			return true;
		}
		return false;
	}
	/**
	 * returns true only on the frame the key is pressed in
	 * @param {string|number} keyCode 
	 * @return {boolean} state
	 */
	getKeyDown(keyCode: string | number): boolean {
		return (
			this.keyboard.activity.down.indexOf(this.mapKeyboard(keyCode)) > -1
		);
	}
	/**
	 * returns true only on the frame the key is released in
	 * @param {string|number} keyCode 
	 * @return {boolean} state
	 */
	getKeyUp(keyCode: string | number): boolean {
		return (
			this.keyboard.activity.up.indexOf(this.mapKeyboard(keyCode)) > -1
		);
	}
	/**
	 * returns if mouse button is pressed
	 * @param {string|number} button 
	 * @return {boolean} state
	 */
	getMouseButton(button: string | number): boolean {
		return this.mouse.down[this.mapMouse(button)] || false;
	}
	/**
	 * returns true only on the frame the mouse is pressed in
	 * @param {string|number} button 
	 * @return {boolean} state
	 */
	getMouseButtonDown(button: string | number): boolean {
		return this.mouse.activity.down.indexOf(this.mapMouse(button)) > -1;
	}
	/**
	 * returns true only on the frame the mouse is released in
	 * @param {string|number} button 
	 * @return {boolean} state
	 */
	getMouseButtonUp(button: string | number): boolean {
		return this.mouse.activity.up.indexOf(this.mapMouse(button)) > -1;
	}
	/**
	 * gets the name of the last device that activity was registered from
	 * @return {string} state
	 */
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
	/**
	 * alias of getLastActivityDevice
	 * @return {boolean} state
	 */
	getDevice() {
		return this.getLastActivityDevice();
	}
}
