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
	describe("lastAction", () => {
		beforeEach(() => {
			keyboard = new Keyboard();
		});
		it("should have lastAction", () => {
			expect(keyboard.lastAction).toBeDefined();
		});
		it("should update lastAction onkeydown", () => {
			expect(keyboard.lastAction).toBe(0);
			window.onkeydown({ keyCode: 1 });
			expect(keyboard.lastAction).toBeGreaterThan(0);
		});
		it("should update lastAction onkeyup", () => {
			expect(keyboard.lastAction).toBe(0);
			window.onkeyup({ keyCode: 1 });
			expect(keyboard.lastAction).toBeGreaterThan(0);
		});
	});
});
