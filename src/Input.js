//@flow

import Mouse from "Mouse";
import Keyboard from "Keyboard";

import defaults from "defaults";

export default class Input {
	mouse: Mouse;
	keyboard: Keyboard;
	constructor() {
		this.mouse = new Mouse();
		this.keyboard = new Keyboard();
	}
	endTick() {
		this.mouse.endTick();
		this.keyboard.endTick();
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
