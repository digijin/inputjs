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
					raw: [{ type: "gamepad", key: 1 }]
				}
			});

			spyOn(input, "getDevice").and.returnValue("gamepad");
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
