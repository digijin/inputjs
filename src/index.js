//@flow

import underscore from "underscore";

import Input from "Input";
let input = new Input();
// window.UnityInput = input; //yuk
export default input;

let tpl = underscore.template(`

    RAW: interval <%= interval %>ms per tick
    <pre>
    mouse position: <%= JSON.stringify(input.mouse.position) %>
    mouse 1 down: <%= JSON.stringify(input.mouse.down) %>
    keys down: <%= JSON.stringify(input.keyboard.down) %>
    </pre>
`);

let interval = 200;
let content;
let update = () => {
	content.innerHTML = tpl({ input, interval });
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
