var gamepads = navigator.getGamepads();

console.log("gamepads", gamepads);

export default class GamePad {
	gamepads: Object;
	constructor() {
		this.gamepads = gamepads;
	}
}

function gamepadHandler(event, connecting) {
	var gamepad = event.gamepad;
	// Note:
	// gamepad === navigator.getGamepads()[gamepad.index]

	if (connecting) {
		gamepads[gamepad.index] = gamepad;
	} else {
		delete gamepads[gamepad.index];
	}
}

window.addEventListener(
	"gamepadconnected",
	function(e) {
		gamepadHandler(e, true);
	},
	false
);
window.addEventListener(
	"gamepaddisconnected",
	function(e) {
		gamepadHandler(e, false);
	},
	false
);

window.addEventListener("gamepadconnected", function(e) {
	console.log(
		"Gamepad connected at index %d: %s. %d buttons, %d axes.",
		e.gamepad.index,
		e.gamepad.id,
		e.gamepad.buttons.length,
		e.gamepad.axes.length
	);
	console.log(e.gamepad.buttons);
});