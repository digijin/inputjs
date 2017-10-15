import Keyboard from "Keyboard";
describe("Keyboard unit tests", () => {
	let keyboard;
	beforeAll(() => {
		keyboard = new Keyboard();
	});
	it("should listen to keydown", () => {
		window.onkeydown({ keyCode: 1 });
		expect(keyboard.getButton(1)).toBe(true);
	});
	it("should listen to keyup", () => {
		window.onkeyup({ keyCode: 1 });
		expect(keyboard.getButton(1)).toBe(false);
	});
});
