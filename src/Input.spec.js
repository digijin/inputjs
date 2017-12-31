import Input from "Input";

describe("Input unit tests", () => {
	beforeAll(() => {
		navigator.getGamepads = () => {
			return { 0: false, length: 1 };
		};
	});
	it("should exist", () => {
		expect(Input).toBeDefined();
	});
	it("should be a class", () => {
		expect(() => {
			new Input();
		}).not.toThrow();
	});

	describe("getButton", () => {
		it("should have array format optional", () => {
			let input = new Input({
				buttons: { test: { type: "keyboard", key: "space" } }
			});
			expect(input.getButton("test")).toBeFalsy();
		});
		it("return mouse", () => {
			let input = new Input({
				buttons: { test: { type: "mouse", key: "left" } }
			});

			expect(input.getButton("test")).toBeFalsy();
		});
	});
	describe("getButtonDown", () => {
		it("should have array format optional", () => {
			let input = new Input({
				buttons: { test: { type: "keyboard", key: "space" } }
			});
			expect(input.getButtonDown("test")).toBeFalsy();
		});
		it("gamepad", () => {
			let input = new Input({
				buttons: { test: { type: "gamepad", key: "a" } }
			});
			spyOn(input, "getDevice").and.returnValue("gamepad");
			// expect(input.getButtonDown("test")).toBeFalsy();
			expect(() => {
				input.getButtonDown("test");
			}).not.toThrow();
		});
		it("mouse", () => {
			let input = new Input({
				buttons: { test: { type: "mouse", key: "left" } }
			});
			// spyOn(input, "getDevice").and.returnValue("gamepad");
			// expect(input.getButtonDown("test")).toBeFalsy();
			expect(() => {
				input.getButtonDown("test");
			}).not.toThrow();
		});
		it("keyboard ignored in game", () => {
			let input = new Input({
				buttons: { test: { type: "keyboard", key: "space" } }
			});
			spyOn(input, "getDevice").and.returnValue("gamepad");
			expect(input.getButtonDown("test")).toBeFalsy();
		});
		it("multiple weights combined", () => {
			let input = new Input({
				buttons: {
					test: [
						{ type: "keyboard", key: "left" },
						{ type: "keyboard", key: "space" },
						{ type: "keyboard", key: "ctrl" }
					]
				}
			});
			expect(input.getButtonDown("test")).toBe(0);
		});
	});

	describe("map resolution fallbacks", () => {
		let input;
		beforeEach(() => {
			input = new Input();
		});
		it("mapMouse", () => {
			expect(input.mapMouse("123")).toBe(123);
		});
		it("mapGamepad", () => {
			expect(input.mapGamepad("123")).toBe(123);
		});
		it("button", () => {
			expect(() => {
				input.button("abc123");
			}).toThrow();
		});
		it("button", () => {
			expect(Array.isArray(input.button(1))).toBe(true);
		});
		it("getAxis", () => {
			expect(() => {
				input.getAxis("abc123");
			}).toThrow(new Error("getAxis undefined axis: abc123"));
		});
		it("getAxis with bad type", () => {
			input = new Input({ axes: { test: [{ type: "whatever" }] } });
			expect(input.getAxis("test")).toBe(0);
		});
		it("getGamePadButton", () => {
			expect(() => {
				input.getGamePadButton("nobutt");
			}).toThrow();
		});
	});
	describe("general", () => {
		it("getAxis empty", () => {
			let input = new Input({ axes: { empty: [] } });
			expect(input.getAxis("empty")).toBe(0);
		});
	});
	describe("gamepad", () => {
		let input;
		beforeEach(() => {
			input = new Input({
				gamepadMapping: {
					a: 0,
					b: 1
				},
				buttons: {
					mapped: [{ type: "gamepad", button: "a" }],
					raw: [{ type: "gamepad", key: 1 }],
					mousey: { type: "mouse", key: "left" }
				}
			});

			spyOn(input, "getDevice").and.returnValue("gamepad");
		});
		it("should ignore mouse in gamepad mode", () => {
			spyOn(input, "getMouseButton");
			input.getButton("mousey");
			expect(input.getMouseButton).not.toHaveBeenCalled();
		});
		describe("mapGamepad", () => {
			it("sohuld return number", () => {
				expect(input.mapGamepad(0)).toBe(0);
			});
			it("should map from string", () => {
				expect(input.mapGamepad("a")).toBe(0);
			});
		});
		describe("getButton", () => {
			it("should return mapped", () => {
				spyOn(navigator, "getGamepads").and.returnValue({
					length: 1,
					"0": { timestamp: 1, buttons: [{ value: 1 }, { value: 0 }] }
				});
				input.endTick();
				expect(input.getButton("mapped")).toBe(1);
			});
		});
	});
	describe("mouse", () => {
		it("should map", () => {
			let input = new Input();
			expect(input.mapMouse("left")).toBe(0);
			expect(input.mapMouse("middle")).toBe(1);
			expect(input.mapMouse("right")).toBe(2);
		});
		it("should pass target", () => {
			let div = document.createElement("DIV");
			let input = new Input({ target: div });
			expect(input.mouse.target).toBe(div);
		});
		it("mousewheel", () => {
			let input = new Input({ axes: { mousey: [{ type: "mouse" }] } });
			input.mouse.activity.wheelDelta.y = 123;
			expect(input.getAxis("mousey")).toBe(123);
		});
	});
	describe("keyboard", () => {
		let input;
		beforeEach(() => {
			input = new Input({
				keyboardMapping: {
					test: 12,
					test2: 34,
					space: 32
				},
				buttons: {
					mapped: [{ type: "keyboard", key: "test" }],
					raw: [{ type: "keyboard", key: 2 }]
				}
			});
		});

		describe("getButtonDown", () => {
			it("should return true on the frame the button is pressed", () => {
				input.keyboard.activity.down = [2];
				expect(input.getButtonDown("raw")).toBeTruthy();
			});
		});
		describe("getButton", () => {
			it("should return if raw", () => {
				input.keyboard = { down: [2] };
				expect(input.getButton("raw")).toBeTruthy();
			});
			it("should false if not raw", () => {
				input.keyboard = { down: [] };
				expect(input.getButton("raw")).toBeFalsy();
			});
		});
		describe("getKey", () => {
			it("general", () => {
				input.keyboard = { down: [12] };
				expect(input.getKey("test")).toBe(1);
				expect(input.getKey("12")).toBe(1);
				expect(input.getKey("test2")).toBe(0);
				input.keyboard = { down: [34] };
				expect(input.getKey("test")).toBe(0);
				expect(input.getKey("test2")).toBe(1);
			});
			it("maps to parsed ", () => {
				input.keyboard = { down: [12] };
				expect(input.getKey("12")).toBeTruthy();
			});
		});

		describe("mapKeyboard", () => {
			it("sohuld map", () => {
				expect(input.keyboardMapping).toBeDefined();
				expect(input.mapKeyboard("space")).toBe(32);
			});
		});

		describe("getKeyDown", () => {
			it("should ignore duplicates", () => {
				expect(input.getKeyDown("space")).toBe(false);
				input.endTick();
				window.onkeydown({ keyCode: 32 });
				expect(input.keyboard.activity.down[0]).toBe(32);
				expect(input.getKeyDown("space")).toBe(true);
				input.endTick();
				window.onkeydown({ keyCode: 32 }); //ignore duplicates
				expect(input.getKeyDown("space")).toBe(false);
			});
		});
		describe("getKeyUp", () => {
			it("should change per tick", () => {
				expect(input.getKeyUp("space")).toBe(false);
				window.onkeyup({ keyCode: 32 });
				expect(input.getKeyUp("space")).toBe(true);
				input.endTick();
				expect(input.getKeyUp("space")).toBe(false);
			});
		});
	});
});
