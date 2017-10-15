import Input from "Input";

let mouseEvent = function(eventName, params) {
	const target = document;
	let event = document.createEvent("Event");
	Object.assign(event, params);
	event.initEvent(eventName, true, true);
	if (!target) {
		debugger;
		throw new Error("no target");
	}
	target.dispatchEvent(event); //was document
};

describe("Input integration tests", () => {
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
	it("should exist", () => {
		expect(Input).toBeDefined();
	});
	it("should be a class", () => {
		expect(input).toBeDefined();
	});
	describe("mouse", () => {
		beforeEach(() => {});
		it("should have mouse functions", () => {
			expect(input.getMouseButton).toBeDefined();
		});
		it("should detect mouse move", () => {
			expect(input.mouse.position.x).toBe(0);
			expect(input.mouse.position.y).toBe(0);
			mouseEvent("mousemove", { clientX: 10, clientY: 20 });
			expect(input.mouse.position.x).toBe(10);
			expect(input.mouse.position.y).toBe(20);
		});
	});
	describe("getMouseButton", () => {
		it("should detect clicks", () => {
			expect(input.getMouseButton(0)).toBe(false);
			mouseEvent("mousedown", { button: 0 });
			expect(input.getMouseButton(0)).toBe(true);
			mouseEvent("mouseup", { button: 0 });
			expect(input.getMouseButton(0)).toBe(false);
		});
	});

	describe("endTick", () => {
		it("should notify gamepad", () => {
			spyOn(input.gamepad, "endTick");
			input.endTick();
			expect(input.gamepad.endTick).toHaveBeenCalled();
		});
		it("should notify keyboard", () => {
			spyOn(input.keyboard, "endTick");
			input.endTick();
			expect(input.keyboard.endTick).toHaveBeenCalled();
		});
		it("should notify mouse", () => {
			spyOn(input.mouse, "endTick");
			input.endTick();
			expect(input.mouse.endTick).toHaveBeenCalled();
		});
	});

	describe("getButtonDown", () => {
		describe("GamePad", () => {
			it("");
		});
	});
});
