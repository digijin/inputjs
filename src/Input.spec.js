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
	describe("keyboard", () => {
		let input;
		beforeEach(() => {
			input = new Input({
				mapping: {
					test: 12,
					test2: 34
				},
				buttons: {
					mapped: [{ type: "keyboard", key: "test" }],
					raw: [{ type: "keyboard", key: 2 }]
				}
			});
		});
		describe("getButton", () => {
			it("should return if raw", () => {
				input.keyboard = { down: [2] };
				expect(input.getButton("raw")).toBe(true);
			});
			it("should false if not raw", () => {
				input.keyboard = { down: [] };
				expect(input.getButton("raw")).toBe(false);
			});
		});
		describe("getKey", () => {
			it("general", () => {
				input.keyboard = { down: [12] };
				expect(input.getKey("test")).toBe(true);
				expect(input.getKey("12")).toBe(true);
				expect(input.getKey("test2")).toBe(false);
				input.keyboard = { down: [34] };
				expect(input.getKey("test")).toBe(false);
				expect(input.getKey("test2")).toBe(true);
			});
			it("maps to parsed ", () => {
				input.keyboard = { down: [12] };
				expect(input.getKey("12")).toBe(true);
			});
		});
	});
});
