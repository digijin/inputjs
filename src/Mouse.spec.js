import Mouse from "Mouse";

let mouseEvent = function(eventName, params, target = document) {
	let event = document.createEvent("Event");
	Object.assign(event, params);
	event.initEvent(eventName, true, true);
	if (!target) {
		debugger;
		throw new Error("no target");
	}
	target.dispatchEvent(event); //was document
};

describe("Mouse unit test", () => {
	let mouse;
	beforeEach(() => {
		mouse = new Mouse();
	});
	describe("lastAction", () => {
		it("should init at 0", () => {
			expect(mouse.lastAction).toBe(0);
		});
		it("should update from mousedown", () => {
			mouseEvent("mousedown", { button: 0 });
			expect(mouse.lastAction).toBeGreaterThan(0);
		});
		it("should update from mouseup", () => {
			mouseEvent("mouseup", { button: 0 });
			expect(mouse.lastAction).toBeGreaterThan(0);
		});
		it("should update from mousemove", () => {
			mouseEvent("mousemove", { clientX: 0, clientY: 0 });
			expect(mouse.lastAction).toBeGreaterThan(0);
		});
	});
	describe("target", () => {
		let div;
		beforeEach(() => {
			div = document.createElement("DIV");
			mouse = new Mouse(div);
		});
		it("should not fire when not clicking target", () => {
			mouseEvent("mousedown", { button: 0 });
			expect(mouse.down[0]).not.toBeDefined();
		});
		it("should fire when clicking target", () => {
			mouseEvent("mousedown", { button: 0 }, div);
			expect(mouse.down[0]).toBeTruthy();
		});
	});
	describe("mousewheel", () => {
		let div;
		beforeEach(() => {
			div = document.createElement("DIV");
			mouse = new Mouse(div);
		});
		it("should detect scroll", () => {
			mouseEvent("wheel", { deltaX: 1, deltaY: 2 }, div);
			expect(mouse.activity.wheelDelta.x).toBe(1);
			expect(mouse.activity.wheelDelta.y).toBe(2);
		});
	});
});
