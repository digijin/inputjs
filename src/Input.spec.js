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
});
