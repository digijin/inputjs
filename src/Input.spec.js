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
		it("getKey", () => {
			input.keyboard = { down: [12] };
			expect(input.getKey("test")).toBe(true);
			expect(input.getKey("test2")).toBe(false);
			input.keyboard = { down: [34] };
			expect(input.getKey("test")).toBe(false);
			expect(input.getKey("test2")).toBe(true);
		});
	});
});
