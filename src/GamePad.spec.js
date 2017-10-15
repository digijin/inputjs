import GamePad from "GamePad";

describe("GamePad unit tests", () => {
	let gamepad;
	beforeEach(() => {
		gamepad = new GamePad();
	});
	describe("getGamePad", () => {
		it("should return any non null object in gamepads", () => {
			let gp = { name: "gamepad" };
			gamepad.gamepads = [null, null, gp, null, null];
			expect(gamepad.getGamePad()).toBe(gp);
		});
	});
});
