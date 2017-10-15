import Point from "Point";
describe("Point unit tests", () => {
	let point;

	beforeEach(() => {
		point = new Point({ x: 10, y: 20 });
	});
	describe("constructor", () => {
		it("should init to 0 if no params", () => {
			expect(new Point().x).toBe(0);
			expect(new Point().y).toBe(0);
		});
	});

	describe("clone", () => {
		it("should make a copy of point", () => {
			expect(point.clone().x).toBe(point.x);
		});
	});
	describe("add", () => {
		it("should add", () => {
			expect(point.add({ x: 10, y: 0 }).x).toBe(20);
		});
	});
	describe("subtract", () => {
		it("should subtract", () => {
			expect(point.subtract({ x: 10, y: 0 }).x).toBe(0);
		});
	});
});
