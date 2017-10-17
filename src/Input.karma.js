import Input from "Input";

let mouseEvent = function(eventName, params) {
	const target = document;
	let event = document.createEvent("Event");
	Object.assign(event, params);
	event.initEvent(eventName, true, true);
	if (!target) {
		debugger;
		throw new Error("no target");
	}
	target.dispatchEvent(event); //was document
};

let mockGamepad = () => {
	return {
		timestamp: 0,
		axes: [0, 0, 0, 0],
		buttons: [
			{ pressed: false, value: 0 },
			{ pressed: false, value: 0 },
			{ pressed: false, value: 0 },
			{ pressed: false, value: 0 }
		]
	};
};

describe("Input integration tests", () => {
	let input;

	beforeEach(() => {
		input = new Input({
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
			mapping: {
				test: 12,
				test2: 34,
				left: 37,
				up: 38,
				right: 39,
				down: 40
			},
			buttons: {
				jump: [
					{ type: "gamepad", button: 0 },
					{ type: "keyboard", key: 32 }
				],
				special: [
					{ type: "gamepad", button: 1 },
					{ type: "mouse", button: 2 }
				],
				fire: [
					{ type: "gamepad", button: 2 },
					{ type: "keyboard", key: "ctrl" },
					{ type: "mouse", button: 0 }
				],
				mapped: [{ type: "keyboard", key: "test" }],
				raw: [{ type: "keyboard", key: 2 }]
			}
		});
	});
	it("should exist", () => {
		expect(Input).toBeDefined();
	});
	it("should be a class", () => {
		expect(input).toBeDefined();
	});
	describe("mouse", () => {
		beforeEach(() => {});
		it("should have mouse functions", () => {
			expect(input.getMouseButton).toBeDefined();
		});
		it("should detect mouse move", () => {
			expect(input.mouse.position.x).toBe(0);
			expect(input.mouse.position.y).toBe(0);
			mouseEvent("mousemove", { clientX: 10, clientY: 20 });
			expect(input.mouse.position.x).toBe(10);
			expect(input.mouse.position.y).toBe(20);
		});
	});
	describe("getMouseButton", () => {
		it("should detect clicks", () => {
			expect(input.getMouseButton(0)).toBe(false);
			mouseEvent("mousedown", { button: 0 });
			expect(input.getMouseButton(0)).toBe(true);
			mouseEvent("mouseup", { button: 0 });
			expect(input.getMouseButton(0)).toBe(false);
		});
	});
	describe("getAxis", () => {
		it("should exist", () => {
			expect(input.getAxis).toBeDefined();
		});
		it("should keyboard", () => {
			window.onkeydown({ keyCode: 37 });
			expect(input.getDevice()).toBe("keyboard");
			expect(input.getKey("left")).toBe(true);
			expect(input.getAxis("horizontal")).toBe(-1);
			window.onkeydown({ keyCode: 39 });
			expect(input.getKey("right")).toBe(true);
			expect(input.getAxis("horizontal")).toBe(0);
			window.onkeyup({ keyCode: 37 });
			expect(input.getKey("left")).toBe(false);
			expect(input.getAxis("horizontal")).toBe(1);
		});
		it("should gamepad", () => {
			let gp = mockGamepad();
			gp.timestamp = 100;
			gp.axes[0] = 1;
			spyOn(navigator, "getGamepads").and.returnValue({
				length: 1,
				"0": gp
			});
			input.endTick();
			expect(input.getDevice()).toBe("gamepad");
			expect(input.getAxis("horizontal")).toBe(1);
		});
		// it("should gamepad", ());
	});

	describe("endTick", () => {
		it("should notify gamepad", () => {
			spyOn(input.gamepad, "endTick");
			input.endTick();
			expect(input.gamepad.endTick).toHaveBeenCalled();
		});
		it("should notify keyboard", () => {
			spyOn(input.keyboard, "endTick");
			input.endTick();
			expect(input.keyboard.endTick).toHaveBeenCalled();
		});
		it("should notify mouse", () => {
			spyOn(input.mouse, "endTick");
			input.endTick();
			expect(input.mouse.endTick).toHaveBeenCalled();
		});
	});

	describe("getButton", () => {
		describe("active device selective ignorance", () => {
			it("should return keyboard value if it was used after gamepad", () => {
				let gp = mockGamepad();
				gp.timestamp = 1;
				gp.buttons[0].pressed = true;
				gp.buttons[0].value = 1;
				spyOn(navigator, "getGamepads").and.returnValue({
					length: 1,
					"0": gp
				});
				input.endTick();
				expect(input.getLastActivityDevice()).toBe("gamepad");
				expect(input.getButton("jump")).toBe(1);
				window.onkeyup({ keyCode: 32 });
				expect(input.getLastActivityDevice()).toBe("keyboard");
				expect(input.getButton("jump")).toBe(0);
			});
			it("should return gamepad value if it was used after keyboard", done => {
				window.onkeydown({ keyCode: 32 });
				expect(input.getLastActivityDevice()).toBe("keyboard");
				expect(input.getButton("jump")).toBe(1);
				setTimeout(() => {
					//due to endtick a little bit later
					let gp = mockGamepad();
					gp.timestamp = 1;
					gp.buttons[0].pressed = false;
					gp.buttons[0].value = 0;
					spyOn(navigator, "getGamepads").and.returnValue({
						length: 1,
						"0": gp
					});
					input.endTick();
					expect(input.getLastActivityDevice()).toBe("gamepad");
					expect(input.getButton("jump")).toBe(0);
					done();
				}, 10);
			});
		});
		describe("GamePad", () => {
			// it("should register");
		});
	});

	describe("getButtonDown", () => {
		describe("keyboard", () => {
			// it("should change from frame to frame", () => {
			// 	expect(input.getButtonDown("raw")).toBe(false);
			// });
		});
	});
	describe("getLastActivityDevice", () => {
		it("mouse", () => {
			mouseEvent("mousemove", { clientX: 10, clientY: 20 });
			expect(input.getLastActivityDevice()).toBe("mouse");
		});
		it("keyboard", () => {
			window.onkeydown({ keyCode: 1 });
			expect(input.getLastActivityDevice()).toBe("keyboard");
		});
		it("gamepad", () => {
			spyOn(navigator, "getGamepads").and.returnValue({
				"0": { timestamp: 1234 },
				length: 1
			});
			input.endTick();
			expect(input.getLastActivityDevice()).toBe("gamepad");
		});
	});
});
