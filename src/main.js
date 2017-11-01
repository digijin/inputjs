//@flow

import underscore from "underscore";

import Input from "Input";
let input = new Input();
// window.UnityInput = input; //yuk
export default input;

import template from "./demo.html";

let raw = underscore.template(template);

let interval = 200;
let content: HTMLDivElement;
let update = () => {
	content.innerHTML = raw({ input, interval });
	input.endTick();
	if (interval == 0) {
		requestAnimationFrame(update);
	}
};
window.onload = () => {
	content = document.getElementById("content");
	content.innerHTML = "starting";
	if (interval == 0) {
		update();
	} else {
		setInterval(update, interval);
	}
};
