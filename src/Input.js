//@flow

import Mouse from "Mouse";
import Keyboard from "Keyboard";
import GamePad from "GamePad";

import defaults from "defaults";

export default class Input {
	mouse: Mouse;
	keyboard: Keyboard;
	gamepad: GamePad;
	constructor() {
		this.mouse = new Mouse();
		this.keyboard = new Keyboard();
		this.gamepad = new GamePad();
	}
	endTick() {
		this.mouse.endTick();
		this.keyboard.endTick();
		this.gamepad.endTick();
	}
	getAxis() {}
	getButton() {}
	getButtonDown() {}
	getButtonUp() {}
	getJoystickNames() {}
	getKey() {}
	getKeyDown() {}
	getKeyUp() {}
	getMouseButton() {}
	getMouseButtonDown() {}
	getMouseButtonUp() {}
}
