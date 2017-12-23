import GamePad from "GamePad";

//setup for headless
if (!navigator.getGamepads) {
	navigator.getGamepads = () => {
		return { length: 1, "0": null };
	};
}

describe("GamePad unit tests", () => {
	let gamepad;
	beforeEach(() => {
		gamepad = new GamePad();
	});

	it("should cover missing navigator in headless", () => {
		expect(navigator.getGamepads).toBeDefined();
	});

	it("updateGamepads with stale gamepad", () => {
		spyOn(gamepad, "getGamePad").and.returnValue({ timestamp: 123 });
		gamepad.updateGamepads();
		gamepad.lastAction = 123;
		gamepad.updateGamepads();
		expect(gamepad.lastAction).toBe(123);
	});

	describe("getGamePad", () => {
		it("should return any non null object in gamepads", () => {
			let gp = { name: "gamepad" };
			gamepad.gamepads = [null, null, gp, null, null];
			expect(gamepad.getGamePad()).toBe(gp);
		});
	});
	describe("headless", () => {
		it("should not fuck up if no navigator", () => {
			let getgp = navigator.getGamepads;
			navigator.getGamepads = null;
			gamepad = new GamePad();
			gamepad.endTick();
			navigator.getGamepads = getgp;
		});
	});
	describe("lastAction", () => {
		it("should be defined", () => {
			expect(gamepad.lastAction).toBeDefined();
		});
		it("should update if gamepad timestamp changes", () => {
			spyOn(navigator, "getGamepads").and.returnValue({
				"0": { timestamp: 1234 },
				length: 1
			});
			gamepad.endTick();
			expect(gamepad.lastAction).toBeGreaterThan(0);
		});
	});
});
