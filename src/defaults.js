//@flow

export default {
	keyboardMapping: {
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
	mouseMapping: {
		left: 0,
		middle: 1,
		right: 2
	},
	gamepadMapping: {
		//xbox style
		a: 0,
		b: 1,
		x: 2,
		y: 3,
		lb: 4,
		rb: 5,
		lt: 6,
		rt: 7,
		back: 8,
		start: 9,
		lthumb: 10,
		rthumb: 11,
		up: 12,
		down: 13,
		left: 14,
		right: 15
	},
	axes: {
		horizontal: [
			{
				type: "keyboard",
				positive: "right",
				negative: "left"
			},
			{ type: "gamepad", axis: 0 }
		],
		vertical: [
			{
				type: "keyboard",
				positive: "up",
				negative: "down"
			},
			{ type: "gamepad", axis: 1 }
		]
	},
	buttons: {
		jump: [
			{ type: "gamepad", button: "a" },
			{ type: "keyboard", key: "space" }
		],
		special: [
			{ type: "gamepad", button: "b" },
			{ type: "mouse", button: "right" }
		],
		fire: [
			{ type: "gamepad", button: "x" },
			{ type: "keyboard", key: "ctrl" },
			{ type: "mouse", button: "left" }
		]
	}
};
