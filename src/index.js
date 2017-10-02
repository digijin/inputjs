//@flow

import underscore from "underscore";

import Input from "Input";
let input = new Input();
// window.UnityInput = input; //yuk
export default input;

let tpl = underscore.template(`
    mouse position: <%= JSON.stringify(input.mouse.position) %><br />
    mouse 1 down: <%= JSON.stringify(input.mouse.down) %>
`);

let content;
let update = () => {
	// content.innerHTML = "";
	// content.innerHTML += JSON.stringify(input.mouse.position);
	content.innerHTML = tpl({ input });
	input.endTick();
	requestAnimationFrame(update);
};
window.onload = () => {
	content = document.getElementById("content");
	content.innerHTML = "starting";
	update();
};
