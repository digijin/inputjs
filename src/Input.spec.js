import Input from "Input";

describe("Input", () => {
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
	describe("keyboard", () => {
		let input;
		beforeEach(() => {
			input = new Input({
				mapping: {
					test: 1
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
	});
});
